import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const calendarEvents = pgTable("calendar_events", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  date: date("date").notNull(),
  price: integer("price").notNull(), // price in cents
  isBooked: boolean("is_booked").default(false).notNull(),
  bookedBy: varchar("booked_by").references(() => users.id),
  createdAt: date("created_at")
    .default(sql`CURRENT_DATE`)
    .notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCalendarEventSchema = createInsertSchema(
  calendarEvents
).pick({
  date: true,
  price: true,
  isBooked: true,
  bookedBy: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
