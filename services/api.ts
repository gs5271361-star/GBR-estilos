import { Product, User, UserRole, Order, AdminStats, SiteSettings, PaymentMethod, OrderStatus, Address, PasswordReset } from '../types';
import { MOCK_PRODUCTS } from '../constants';

// ============================================================================
// REAL BACKEND SIMULATION LAYERS
// ============================================================================

const DELAY = 800; 

// --- 1. MOCK DATABASE (Stateful) ---

let productsDb: Product[] = [...MOCK_PRODUCTS];

// Seeded Orders
let ordersDb: Order[] = [
  { 
    id: "ord_1001", 
    userId: 2, 
    customerName: 'João Silva', 
    customerEmail: 'joao@exemplo.com',
    customerPhone: '11999999999',
    total: 1299, 
    status: 'DELIVERED', 
    paymentMethod: 'PIX', 
    createdAt: '2023-10-15T14:30:00Z', 
    items: [{ productId: 1, name: 'Blazer Midnight', quantity: 1, price: 1299 }],
    address: { street: 'Rua das Flores 123', city: 'São Paulo', state: 'SP', zip: '01000-000'},
    trackingCode: 'GBR-123456' 
  },
  { 
    id: "ord_1002", 
    userId: 2, 
    customerName: 'Maria Oliveira', 
    customerEmail: 'maria@exemplo.com',
    customerPhone: '11988888888',
    total: 450, 
    status: 'PAID', 
    paymentMethod: 'CREDIT_CARD', 
    createdAt: '2023-10-20T10:15:00Z', 
    items: [{ productId: 4, name: 'Echarpe Ouro', quantity: 1, price: 450 }],
    address: { street: 'Av Paulista 2000', city: 'São Paulo', state: 'SP', zip: '01310-200'}
  },
];

let siteSettingsDb: SiteSettings = {
  siteName: 'GBR Estilos',
  defaultLogo: 'https://cdn-icons-png.flaticon.com/512/5305/5305049.png',
  whatsapp: '5511986628325',
  email: 'contato@gbrestilos.com',
  maintenanceMode: false,
  bannerActive: true,
  homeHeroVisible: true
};

interface DbUser extends User {
  password?: string;
}

const usersDb: DbUser[] = [
  {
    id: 1,
    username: 'gabrielbianca230622',
    name: 'Administrador',
    email: 'admin@gbrestilos.com',
    phone: '11986628325',
    password: 'Gb230622',
    role: UserRole.ADMIN
  },
  {
    id: 2,
    username: 'cliente_demo',
    name: 'Cliente Demo',
    email: 'cliente@demo.com',
    phone: '11999999999',
    password: '123',
    role: UserRole.USER
  }
];

// Password Reset DB Table
let passwordResetsDb: PasswordReset[] = [];

// Rate Limiting (Brute Force Protection)
let loginAttempts: Record<string, { count: number, lastAttempt: number }> = {};

// --- 2. NOTIFICATION SERVICES (Simulated) ---

const WhatsappService = {
  send: async (phone: string, message: string) => {
    // In a real backend, this would call Z-API or Twilio
    console.group('%c [WhatsApp Service Simulation]', 'color: #25D366; font-weight: bold; background: #000; padding: 4px;');
    console.log(`📡 Sending to API: https://api.z-api.io/instances/YOUR_INSTANCE/token/YOUR_TOKEN/send-text`);
    console.log(`📱 To: ${phone}`);
    console.log(`💬 Body: "${message}"`);
    console.groupEnd();
    return true;
  }
};

const MailService = {
  send: async (to: string, subject: string, body: string) => {
    // In a real backend, this would call Nodemailer/SendGrid
    console.group('%c [Mail Service Simulation]', 'color: #FFA500; font-weight: bold; background: #000; padding: 4px;');
    console.log(`📧 SMTP Host: smtp.gmail.com:587`);
    console.log(`✉️ To: ${to}`);
    console.log(`📝 Subject: ${subject}`);
    console.log(`📄 Body: ${body}`);
    console.groupEnd();
    return true;
  }
};

const NotificationLogic = {
  notifyNewOrder: async (order: Order) => {
    const msgCustomer = `Olá ${order.customerName}! Seu pedido #${order.id} foi confirmado. Total: R$ ${order.total.toLocaleString('pt-BR')}. Status: ${order.status}`;
    const msgAdmin = `📦 NOVA VENDA! Pedido #${order.id} de ${order.customerName}. Valor: R$ ${order.total.toLocaleString('pt-BR')}.`;

    // Notify Customer
    if (order.customerPhone) await WhatsappService.send(order.customerPhone, msgCustomer);
    if (order.customerEmail) await MailService.send(order.customerEmail, "Confirmação de Pedido - GBR Estilos", msgCustomer);

    // Notify Admin (Credentials from Seed)
    await WhatsappService.send('5511986628325', msgAdmin);
    await MailService.send('gbrestilos@hotmail.com', "Alerta de Nova Venda", msgAdmin);
  },
  notifyStatusChange: async (order: Order) => {
    // Logic specific to status changes
    if (order.status === 'DELIVERED') {
        const emailBody = `Seu pedido ${order.id} foi entregue com sucesso 🎉`;
        const whatsappBody = `📦 Pedido ${order.id} entregue com sucesso!`;

        if (order.customerEmail) await MailService.send(order.customerEmail, "Pedido entregue", emailBody);
        if (order.customerPhone) await WhatsappService.send(order.customerPhone, whatsappBody);
    } else {
        // Standard notification for other statuses
        const msg = `Atualização do Pedido #${order.id}: Status alterado para ${order.status}.`;
        if (order.customerEmail) await MailService.send(order.customerEmail, "Atualização de Status", msg);
        if (order.customerPhone) await WhatsappService.send(order.customerPhone, msg);
    }
  }
};

// --- 3. API EXPORTS ---

export const api = {
  auth: {
    login: async (login: string, password: string): Promise<{ user: User; token: string }> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Brute Force Check
          const now = Date.now();
          const attempts = loginAttempts[login] || { count: 0, lastAttempt: 0 };
          
          if (attempts.count >= 5 && now - attempts.lastAttempt < 5 * 60 * 1000) {
            return reject(new Error('Muitas tentativas. Aguarde 5 minutos.'));
          }

          const user = usersDb.find(u => 
            (u.email === login || u.username === login) && u.password === password
          );
          
          if (user) {
            // Reset attempts on success
            delete loginAttempts[login];
            
            const token = `jwt_${user.role}_${Date.now()}`;
            const { password: _, ...safeUser } = user;
            resolve({ user: safeUser, token });
          } else {
            // Record failed attempt
            loginAttempts[login] = { count: attempts.count + 1, lastAttempt: now };
            reject(new Error('Credenciais inválidas.'));
          }
        }, DELAY);
      });
    },
    register: async (data: any): Promise<{ user: User; token: string }> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (usersDb.find(u => u.email === data.email || u.username === data.username)) {
            reject(new Error('Usuário já existe.'));
            return;
          }
          const newUser: DbUser = {
            id: Date.now(),
            username: data.username,
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: UserRole.USER
          };
          usersDb.push(newUser);
          const { password: _, ...safeUser } = newUser;
          resolve({ user: safeUser, token: `jwt_${Date.now()}` });
        }, DELAY);
      });
    },
    // DEFINITIVE PASSWORD RECOVERY
    recoverPassword: async (login: string, method: 'email' | 'whatsapp'): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Find user by email OR username (Case insensitive)
                const user = usersDb.find(u => 
                    u.email.toLowerCase() === login.toLowerCase() || 
                    u.username.toLowerCase() === login.toLowerCase()
                );

                if (!user) {
                    // In a real app we might not want to disclose this, but for the requirement:
                    return reject(new Error("Usuário não encontrado. Verifique os dados."));
                }
                
                // Generate 6 digit code
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                
                // Cleanup old resets for this user
                passwordResetsDb = passwordResetsDb.filter(r => r.userId !== user.id);

                // Create PasswordReset record (Expires in 10 mins)
                const resetRecord: PasswordReset = {
                    id: `reset_${Date.now()}`,
                    userId: user.id!,
                    code: code,
                    expiresAt: Date.now() + 10 * 60 * 1000,
                    used: false
                };
                passwordResetsDb.push(resetRecord);

                // Simulate sending code via selected method
                const message = `🔐 Código de recuperação GBR ESTILOS: ${code}`;
                
                if(method === 'whatsapp') {
                    if(!user.phone) return reject(new Error("Usuário não possui telefone cadastrado. Tente por e-mail."));
                    WhatsappService.send(user.phone, message);
                } else {
                    MailService.send(user.email, "Recuperação de Senha", `<p>${message}</p>`);
                }
                
                resolve(true);
            }, DELAY);
        });
    },
    // DEFINITIVE PASSWORD RESET
    resetPassword: async (code: string, newPassword: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Find valid, unused, non-expired code
                const recordIndex = passwordResetsDb.findIndex(r => 
                    r.code === code && 
                    !r.used && 
                    r.expiresAt > Date.now()
                );

                if (recordIndex === -1) {
                    return reject(new Error("Código inválido, expirado ou já utilizado."));
                }
                
                const record = passwordResetsDb[recordIndex];
                const userIndex = usersDb.findIndex(u => u.id === record.userId);

                if(userIndex !== -1) {
                    // Update User Password
                    usersDb[userIndex].password = newPassword;
                    
                    // Mark token as used
                    passwordResetsDb[recordIndex].used = true;
                    
                    resolve();
                } else {
                    reject(new Error("Usuário associado não encontrado."));
                }
            }, DELAY);
        });
    },
    changePassword: async (userId: number, data: {oldPassword: string, newPassword: string}): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const u = usersDb.find(user => user.id === userId);
                if(!u || u.password !== data.oldPassword) return reject(new Error("Senha inválida."));
                u.password = data.newPassword;
                resolve();
            }, DELAY);
        });
    }
  },

  products: {
    getAll: async () => new Promise<Product[]>(r => setTimeout(() => r([...productsDb]), 300)),
    getById: async (id: number) => new Promise<Product|undefined>(r => setTimeout(() => r(productsDb.find(p => p.id === id)), 200)),
    create: async (p: Product) => { productsDb.unshift(p); return p; },
    update: async (p: Product) => { productsDb = productsDb.map(x => x.id === p.id ? p : x); return p; },
    delete: async (id: number) => { productsDb = productsDb.filter(x => x.id !== id); return true; }
  },

  orders: {
    create: async (data: { 
        userId: number, 
        customer: {name: string, email: string, phone: string, address: Address}, 
        items: any[], 
        total: number, 
        paymentMethod: PaymentMethod 
    }): Promise<Order> => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const newOrder: Order = {
            id: `ord_${Date.now()}`,
            userId: data.userId || 2, 
            customerName: data.customer.name,
            customerEmail: data.customer.email,
            customerPhone: data.customer.phone,
            total: data.total,
            status: 'PENDING',
            paymentMethod: data.paymentMethod,
            createdAt: new Date().toISOString(),
            items: data.items.map(i => ({ 
                productId: i.id, 
                name: i.name, 
                quantity: i.quantity, 
                price: parseFloat(i.price.replace('R$', '').replace('.', '').replace(',', '.').trim()) 
            })),
            address: data.customer.address
          };
          
          ordersDb.unshift(newOrder);
          
          // Trigger notifications
          await NotificationLogic.notifyNewOrder(newOrder);
          
          resolve(newOrder);
        }, 1000);
      });
    },
    getMyOrders: async () => new Promise<Order[]>(r => setTimeout(() => r(ordersDb), 500)),
    getById: async (id: string) => new Promise<Order|undefined>(r => setTimeout(() => r(ordersDb.find(o => o.id === id)), 200)),
  },

  admin: {
    getStats: async (): Promise<AdminStats> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const totalRevenue = ordersDb.reduce((sum, order) => sum + order.total, 0);
          resolve({
            totalUsers: usersDb.length,
            totalOrders: ordersDb.length,
            totalRevenue: totalRevenue,
            recentOrders: ordersDb.slice(0, 10)
          });
        }, 400);
      });
    },
    // DEFINITIVE STATUS UPDATE
    updateOrderStatus: async (orderId: string, status: OrderStatus, trackingCode?: string): Promise<Order> => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const orderIndex = ordersDb.findIndex(o => o.id === orderId);
                if(orderIndex === -1) return reject(new Error("Order not found"));
                
                // Update in DB
                const updatedOrder = { ...ordersDb[orderIndex], status, trackingCode };
                ordersDb[orderIndex] = updatedOrder;
                
                // Trigger Notification Service
                await NotificationLogic.notifyStatusChange(updatedOrder);

                resolve(updatedOrder);
            }, DELAY);
        });
    },
    getSettings: async () => Promise.resolve({ ...siteSettingsDb }),
    saveSettings: async (s: SiteSettings) => { siteSettingsDb = s; return; },
    getAllOrders: async () => Promise.resolve([...ordersDb]),
  }
};