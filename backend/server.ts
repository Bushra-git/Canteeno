import express from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}

// PostgreSQL connection pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
  port: parseInt(process.env.DB_PORT || '5432'),
});

app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Test route
app.get('/', (req, res) => {
  res.send('Canteen Management System Backend is running');
});

// Get all menu items
app.get('/menu_items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items WHERE available = true ORDER BY category, name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new menu item (admin only)
app.post('/menu_items', authenticateToken, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { name, description, price, category, image_url } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    const result = await pool.query(
      'INSERT INTO menu_items (name, description, price, category, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, category, image_url]
    );
    // Log the action
    await pool.query(
      'INSERT INTO user_logs (user_id, action, details) VALUES ($1, $2, $3)',
      [req.user.id, 'add_menu_item', JSON.stringify({ menu_item_id: result.rows[0].id, name })]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding menu item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
app.get('/users', authenticateToken, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const result = await pool.query('SELECT id, username, email, role, roll_number, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      return res.status(400).json({ error: 'Identifier is required' });
    }

    // Check if identifier is a valid roll number
    const rollPattern = /^23101A\d{4}$/;
    const isRollNumber = rollPattern.test(identifier);

    // Find user by roll_number, username or email
    const result = await pool.query(
      'SELECT * FROM users WHERE roll_number = $1 OR username = $1 OR email = $1',
      [identifier]
    );

    if (result.rows.length === 0) {
      if (isRollNumber) {
        // Auto-create user for valid roll number
        const username = identifier;
        const email = `${identifier}@student.com`;
        const defaultPassword = 'password'; // Default password for demo
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const createResult = await pool.query(
          'INSERT INTO users (roll_number, username, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [identifier, username, email, hashedPassword, 'user']
        );

        const newUser = createResult.rows[0];
        // Generate JWT token
        const token = jwt.sign(
          { id: newUser.id, username: newUser.username, role: newUser.role, roll_number: newUser.roll_number },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Log the login for new user
        await pool.query(
          'INSERT INTO user_logs (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
          [newUser.id, 'login', JSON.stringify({ identifier }), req.ip, req.get('User-Agent')]
        );

        return res.json({
          token,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            roll_number: newUser.roll_number
          }
        });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    const user = result.rows[0];

    // If it's a roll number, allow login without password check
    if (isRollNumber) {
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, roll_number: user.roll_number },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Log the login
      await pool.query(
        'INSERT INTO user_logs (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
        [user.id, 'login', JSON.stringify({ identifier }), req.ip, req.get('User-Agent')]
      );

      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          roll_number: user.roll_number
        }
      });
    }

    // For non-roll number logins, require password
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, roll_number: user.roll_number },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log the login
    await pool.query(
      'INSERT INTO user_logs (user_id, action, details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 'login', JSON.stringify({ identifier }), req.ip, req.get('User-Agent')]
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        roll_number: user.roll_number
      }
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup endpoint
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password, role, roll_number } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Validate roll_number if provided
    if (roll_number) {
      const rollPattern = /^23101A\d{4}$/;
      if (!rollPattern.test(roll_number)) {
        return res.status(400).json({ error: 'Invalid roll number format. Must be like 23101A0001' });
      }
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2 OR (roll_number IS NOT NULL AND roll_number = $3)',
      [username, email, roll_number || '']
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (roll_number, username, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, roll_number, username, email, role, created_at',
      [roll_number, username, email, hashedPassword, role || 'user']
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Create order
app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await pool.query('SELECT price FROM menu_items WHERE id = $1 AND available = true', [item.menu_item_id]);
      if (menuItem.rows.length === 0) {
        return res.status(400).json({ error: `Menu item ${item.menu_item_id} not found or unavailable` });
      }
      totalAmount += menuItem.rows[0].price * item.quantity;
    }

    // Create order
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, totalAmount, 'pending']
    );

    const order = orderResult.rows[0];

    // Add order items
    for (const item of items) {
      const menuItem = await pool.query('SELECT price FROM menu_items WHERE id = $1', [item.menu_item_id]);
      const price = menuItem.rows[0].price;

      await pool.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.menu_item_id, item.quantity, price]
      );
    }

    // Log the order
    await pool.query(
      'INSERT INTO user_logs (user_id, action, details) VALUES ($1, $2, $3)',
      [userId, 'place_order', JSON.stringify({ order_id: order.id, total_amount: totalAmount })]
    );

    res.status(201).json({
      order: order,
      message: 'Order placed successfully'
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get orders (user's own or all for admin)
app.get('/orders', authenticateToken, async (req, res) => {
  try {
    let query: string, params: any[];
    if (req.user!.role === 'admin') {
      query = `
        SELECT o.*, json_agg(
          json_build_object(
            'id', oi.id,
            'menu_item_id', oi.menu_item_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'menu_item', json_build_object(
              'name', mi.name,
              'description', mi.description
            )
          )
        ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT o.*, json_agg(
          json_build_object(
            'id', oi.id,
            'menu_item_id', oi.menu_item_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'menu_item', json_build_object(
              'name', mi.name,
              'description', mi.description
            )
          )
        ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;
      params = [req.user!.id];
    }
    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending orders for kitchen (admin only)
app.get('/kitchen/orders', authenticateToken, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const result = await pool.query(`
      SELECT o.*, json_agg(
        json_build_object(
          'id', oi.id,
          'menu_item_id', oi.menu_item_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'menu_item', json_build_object(
            'name', mi.name,
            'description', mi.description
          )
        )
      ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.status = 'pending' OR o.status = 'preparing'
      GROUP BY o.id
      ORDER BY o.created_at ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching kitchen orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status (admin only)
app.put('/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    if (!req.user! || req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Log the status update
    await pool.query(
      'INSERT INTO user_logs (user_id, action, details) VALUES ($1, $2, $3)',
      [req.user.id, 'update_order_status', JSON.stringify({ order_id: id, status })]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
