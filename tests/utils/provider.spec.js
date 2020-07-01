const { buildProviderObject } = require("../../utils/provider")
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

const mockProvider = {
  fetchTypes: { A: "a", B: "b", C: "c" },
  defaultFetchType: "b",
  details: { name: "Mock provider", id: "mock" },
  getItems: jest.fn(),
  formatter: jest.fn(),
  defaultCacheTTL: 10
}

describe("buildProviderObject", () => {
  describe("fetchItems function", () => {
    it("should throw an error if provider type does not exist", () => {
      const { fetchItems } = buildProviderObject(mockProvider)
      const type = "nonExisting"

      expect(fetchItems({ numOfItems: 2, type })).rejects.toThrow(
        `type '${type}' is not defined`
      )
    })

    describe("There is no cached result", () => {
      let provider, fetchItems
      beforeEach(() => {
        provider = Object.assign({}, mockProvider, {
          getItems: jest.fn(() => [{}])
        })
        const providerObj = buildProviderObject(provider)
        fetchItems = providerObj.fetchItems
      })

      it("should fetch items using the provider", async () => {
        await fetchItems({ numOfItems: 2 })

        expect(provider.getItems).toBeCalled()
      })

      it("should cache the items returned from the provider", async () => {
        await fetchItems({ numOfItems: 2 })

        expect(cacheResult).toBeCalled()
      })

      it("should format the items using the formatter", async () => {
        await fetchItems({ numOfItems: 2 })

        expect(provider.formatter).toBeCalled()
      })
    })

    describe("There is a cached result", () => {
      let provider
      beforeEach(() => {
        provider = Object.assign({}, mockProvider, {
          getItems: jest.fn(() => [{ from: "provider" }]),
          formatter: jest.fn((item) => item.from)
        })
        const providerObj = buildProviderObject(provider)
        fetchItems = providerObj.fetchItems

        isCacheDataValid.mockReturnValue(true)
        getFromCache.mockReturnValue({
          data: [{ from: "cache" }],
          cachedAt: "1234567"
        })
      })

      it("should get the items from the provider if cached data is invalid", async () => {
        isCacheDataValid.mockReturnValue(false)

        const items = await fetchItems({ numOfItems: 1 })

        expect(provider.getItems).toBeCalled()
        expect(items).toEqual(["provider"])
      })

      it("should not call the provider", async () => {
        const items = await fetchItems({ numOfItems: 1 })

        expect(provider.getItems).not.toBeCalled()
      })

      it("should format the cached items using the formatter", async () => {
        const items = await fetchItems({ numOfItems: 1 })

        expect(provider.formatter).toBeCalled()
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
