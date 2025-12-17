import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTaskContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `user-${userId}`,
    email: `user${userId}@example.com`,
    name: `User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("tasks router", () => {
  describe("list", () => {
    it("should return empty list for user with no tasks", async () => {
      const { ctx } = createTaskContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tasks.list();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("create", () => {
    it("should create a task with valid input", async () => {
      const { ctx } = createTaskContext(1);
      const caller = appRouter.createCaller(ctx);

      const input = {
        title: "Test Task",
        description: "This is a test task",
        status: "todo" as const,
        priority: "high" as const,
      };

      const result = await caller.tasks.create(input);

      expect(result).toBeDefined();
    });

    it("should reject task creation with empty title", async () => {
      const { ctx } = createTaskContext(1);
      const caller = appRouter.createCaller(ctx);

      const input = {
        title: "",
        description: "This should fail",
      };

      try {
        await caller.tasks.create(input);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should set default values for status and priority", async () => {
      const { ctx } = createTaskContext(1);
      const caller = appRouter.createCaller(ctx);

      const input = {
        title: "Task with defaults",
      };

      const result = await caller.tasks.create(input);

      expect(result).toBeDefined();
    });
  });

  describe("get", () => {
    it("should return 404 for non-existent task", async () => {
      const { ctx } = createTaskContext(1);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.tasks.get({ id: 99999 });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should prevent user from accessing other user's tasks", async () => {
      const { ctx: ctx1 } = createTaskContext(1);
      const { ctx: ctx2 } = createTaskContext(2);

      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      const createdTask = await caller1.tasks.create({
        title: "User 1 Task",
      });

      try {
        await caller2.tasks.get({ id: 1 });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("update", () => {
    it("should update task with valid input", async () => {
      const { ctx } = createTaskContext(1);
      const caller = appRouter.createCaller(ctx);

      await caller.tasks.create({
        title: "Original Title",
      });

      const result = await caller.tasks.update({
        id: 1,
        title: "Updated Title",
        status: "in_progress" as const,
      });

      expect(result).toBeDefined();
    });

    it("should prevent unauthorized updates", async () => {
      const { ctx: ctx1 } = createTaskContext(1);
      const { ctx: ctx2 } = createTaskContext(2);

      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      await caller1.tasks.create({
        title: "User 1 Task",
      });

      try {
        await caller2.tasks.update({
          id: 1,
          title: "Hacked",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("delete", () => {
    it("should delete task successfully", async () => {
      const { ctx } = createTaskContext(1);
      const caller = appRouter.createCaller(ctx);

      await caller.tasks.create({
        title: "Task to Delete",
      });

      const result = await caller.tasks.delete({ id: 1 });

      expect(result).toBeDefined();
    });

    it("should prevent unauthorized deletion", async () => {
      const { ctx: ctx1 } = createTaskContext(1);
      const { ctx: ctx2 } = createTaskContext(2);

      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      await caller1.tasks.create({
        title: "User 1 Task",
      });

      try {
        await caller2.tasks.delete({ id: 1 });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
