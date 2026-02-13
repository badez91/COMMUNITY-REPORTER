// jest.setup.ts
import * as nextAuth from "next-auth";

// Mock getServerSession globally
jest.mock("next-auth", () => ({
  ...jest.requireActual("next-auth"),
  getServerSession: jest.fn().mockResolvedValue({
    user: { id: "user-id-123", email: "test@example.com", name: "Test User" },
  }),
}));
