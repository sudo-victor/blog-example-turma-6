import { Hasher } from "./hasher";

export class MyHasher implements Hasher {
  async encrypt(value: string): Promise<string> {
    return value + "_hashed"
  }
  compare(value: string, hashed: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}