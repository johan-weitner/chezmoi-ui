import { describe, it, expect, vi } from "vitest";
import { PrismaClient } from "@prisma/client";

export const mockApps = [
  {
    id: 1,
    key: 'ack',
    name: 'Ack',
    edited: false,
    done: false
  },
  {
    id: 2,
    key: 'act',
    name: 'Act',
    edited: true,
    done: false
  },
  {
    id: 3,
    key: 'bababa',
    name: 'bababa',
    edited: false,
    done: false
  }
];

export const mockGroups = [
  {
    id: 1,
    name: 'AI'
  },
  {
    id: 2,
    name: 'AI-Desktop'
  },
  {
    id: 3,
    name: 'Android'
  },
  {
    id: 4,
    name: 'Android-Desktop'
  }
]

export const mockTags = [
  {
    id: 1,
    name: 'cli'
  },
  {
    id: 2,
    name: 'desktop'
  },
  {
    id: 3,
    name: 'dev'
  }
]