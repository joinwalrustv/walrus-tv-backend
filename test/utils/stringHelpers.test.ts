import { expect } from "chai";
import { decodeHtmlEntity, formatTimestamp } from "../../src/utils/stringHelpers";

describe("Utils", () => {
  describe("decodeHtmlEntity", () => {
    it("should decode numeric HTML entities to characters", () => {
      const encodedStr1 = "Hello &#65;&#66;&#67;";
      expect(decodeHtmlEntity(encodedStr1)).to.equal("Hello ABC");
  
      const encodedStr2 = "Number &#49;&#50;&#51;";
      expect(decodeHtmlEntity(encodedStr2)).to.equal("Number 123");
    });
  
    it("should return the same string if there are no entities", () => {
      const noEntityStr = "Just a regular string";
      expect(decodeHtmlEntity(noEntityStr)).to.equal("Just a regular string");
    });
  
    it("should handle empty strings", () => {
      const emptyStr = "";
      expect(decodeHtmlEntity(emptyStr)).to.equal("");
    });
  });

  describe("formatTimestamp", () => {
    it("should format timestamp correctly", () => {
      const ms = 12000;
      expect(formatTimestamp(ms)).to.equal("0:12");
    });

    it("should format timestamp correctly below 10 seconds", () => {
      const ms = 1000;
      expect(formatTimestamp(ms)).to.equal("0:01");
    });
  });
});
