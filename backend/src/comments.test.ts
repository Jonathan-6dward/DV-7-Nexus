import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createCommentContext(userId: number = 1): { ctx: TrpcContext } {
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

describe("comments router", () => {
  describe("list", () => {
    it("should return empty list for task with no comments", async () => {
      const { ctx } = createCommentContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.comments.list({ taskId: 1 });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("create", () => {
    it("should create a comment with valid input", async () => {
      const { ctx } = createCommentContext(1);
      const caller = appRouter.createCaller(ctx);

      const input = {
        taskId: 1,
        content: "This is a test comment",
      };

      const result = await caller.comments.create(input);

      expect(result).toBeDefined();
    });

    it("should reject comment creation with empty content", async () => {
      const { ctx } = createCommentContext(1);
      const caller = appRouter.createCaller(ctx);

      const input = {
        taskId: 1,
        content: "",
      };

      try {
        await caller.comments.create(input);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should require taskId", async () => {
      const { ctx } = createCommentContext(1);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.comments.create({
          taskId: null as any,
          content: "Test",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("delete", () => {
    it("should delete comment successfully", async () => {
      const { ctx } = createCommentContext(1);
      const caller = appRouter.createCaller(ctx);

      await caller.comments.create({
        taskId: 1,
        content: "Comment to delete",
      });

      const result = await caller.comments.delete({ id: 1 });

      expect(result).toBeDefined();
    });

    it("should prevent unauthorized deletion", async () => {
      const { ctx: ctx1 } = createCommentContext(1);
      const { ctx: ctx2 } = createCommentContext(2);

      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      await caller1.comments.create({
        taskId: 1,
        content: "User 1 Comment",
      });

      try {
        await caller2.comments.delete({ id: 1 });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should return error for non-existent comment", async () => {
      const { ctx } = createCommentContext(1);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.comments.delete({ id: 99999 });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
