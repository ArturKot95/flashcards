import assert from "assert";
import { expect } from 'chai';

describe("flashcards-meteor", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    expect(name).equals('flashcards-meteor');
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
