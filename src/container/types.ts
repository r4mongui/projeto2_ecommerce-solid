export const TYPES = {
  PrismaClient: Symbol.for('PrismaClient'),
  OrderRepository: Symbol.for('OrderRepository'),
  MailProvider: Symbol.for('MailProvider'),
  PaymentMethod: Symbol.for('PaymentMethod'),
  PaymentMethodRegistry: Symbol.for('PaymentMethodRegistry'),
  NotificationService: Symbol.for('NotificationService'),
  OrderService: Symbol.for('OrderService'),
  OrderController: Symbol.for('OrderController'),
} as const;
