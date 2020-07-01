const { buildSourceObject } = require("../../utils/source")
const {
  getFromCache,
  isCacheDataValid,
  cacheResult
} = require("../../utils/cache")

jest.mock("../../utils/cache.js", () => ({
  cacheResult: jest.fn(),
  getFromCache: jest.fn(),
  isCacheDataValid: jest.fn()
}))

const mockSource = {
  fetchTypes: { A: "a", B: "b", C: "c" },
  defaultFetchType: "b",
  details: { name: "Mock source", id: "mock" },
  getItems: jest.fn(),
  formatter: jest.fn(),
  defaultCacheTTL: 10
}

describe("buildSourceObject", () => {
  describe("fetchItems function", () => {
    it("should throw an error if source type does not exist", () => {
      const { fetchItems } = buildSourceObject(mockSource)
      const type = "nonExisting"

      expect(fetchItems({ numOfItems: 2, type })).rejects.toThrow(
        `type '${type}' is not defined`
      )
    })

    describe("There is no cached result", () => {
      let source, fetchItems
      beforeEach(() => {
        source = Object.assign({}, mockSource, {
          getItems: jest.fn(() => [{}])
        })
        const sourceObj = buildSourceObject(source)
        fetchItems = sourceObj.fetchItems
      })

      it("should fetch items using the source", async () => {
        await fetchItems({ numOfItems: 2 })

        expect(source.getItems).toBeCalled()
      })

      it("should cache the items returned from the source", async () => {
        await fetchItems({ numOfItems: 2 })

        expect(cacheResult).toBeCalled()
      })

      it("should format the items using the formatter", async () => {
        await fetchItems({ numOfItems: 2 })

        expect(source.formatter).toBeCalled()
      })
    })

    describe("There is a cached result", () => {
      let source
      beforeEach(() => {
        source = Object.assign({}, mockSource, {
          getItems: jest.fn(() => [{ from: "source" }]),
          formatter: jest.fn((item) => item.from)
        })
        const sourceObj = buildSourceObject(source)
        fetchItems = sourceObj.fetchItems

        isCacheDataValid.mockReturnValue(true)
        getFromCache.mockReturnValue({
          data: [{ from: "cache" }],
          cachedAt: "1234567"
        })
      })

      it("should get the items from the source if cached data is invalid", async () => {
        isCacheDataValid.mockReturnValue(false)

        const items = await fetchItems({ numOfItems: 1 })

        expect(source.getItems).toBeCalled()
        expect(items).toEqual(["source"])
      })

      it("should not call the source", async () => {
        const items = await fetchItems({ numOfItems: 1 })

        expect(source.getItems).not.toBeCalled()
      })

      it("should format the cached items using the formatter", async () => {
        const items = await fetchItems({ numOfItems: 1 })

        expect(source.formatter).toBeCalled()
        expect(items).toEqual(["cache"])
      })

      it("should return the required number of items", async () => {
        const requiredNumberOfItems = 2
        getFromCache.mockReturnValue({
          data: [{ from: "cache1" }, { from: "cache2" }, { from: "cache3" }],
          cachedAt: "1234567"
        })

        const items = await fetchItems({ numOfItems: requiredNumberOfItems })

        expect(items.length).toEqual(requiredNumberOfItems)
        expect(items).toEqual(["cache1", "cache2"])
      })
    })
  })
})
