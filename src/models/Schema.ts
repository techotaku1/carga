import { boolean, integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// It automatically run the command `db-server:file`, which apply the migration before Next.js starts in development mode,
// Alternatively, if your database is running, you can run `npm run db:migrate` and there is no need to restart the server.

// Need a database for production? Check out https://get.neon.com/BMFYNtx
// Tested and compatible with Next.js Boilerplate

export const counterSchema = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const cargoReportsSchema = pgTable('cargo_reports', {
  id: uuid('id').primaryKey(),
  userId: text('user_id').notNull(),
  plate: text('plate').notNull().default(''),
  date: text('date').notNull().default(''), // ISO yyyy-mm-dd
  loadNumber: text('load_number').notNull().default(''),
  company: text('company').notNull().default(''),
  city: text('city').notNull().default(''),
  driver: text('driver').notNull().default(''),
  note: text('note').notNull().default(''),
  fullValue: integer('full_value').notNull().default(0), // valor completo del flete (con ganancia)
  extraProfit: integer('extra_profit').notNull().default(0), // ganancia extra
  fuelCost: integer('fuel_cost').notNull().default(0),
  tollCost: integer('toll_cost').notNull().default(0),
  otherCost: integer('other_cost').notNull().default(0),
  driverPayment: integer('driver_payment').notNull().default(0), // pago al conductor
  paid: boolean('paid').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
