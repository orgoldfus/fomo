const mockSet = jest.fn()
const mockGet = jest.fn()
const mockDelete = jest.fn()
const mockClear = jest.fn()
jest.doMock("configstore", () => {
  return jest.fn().mockImplementation(() => ({
    set: mockSet,
    get: mockGet,
    delete: mockDelete,
    clear: mockClear
  }))
})

const {
  cacheResult,
  clearCache,
  getFromCache,
  isCacheDataValid
} = require("../../utils/cache")

const sourceId = "sourceSomth"
const type = "someType"

describe("cacheResult", () => {
  it("should build the key using the source and the type", () => {
    const data = { foo: "bar" }

    cacheResult(sourceId, type, data)

    const call = mockSet.mock.calls[0]
    expect(call[0]).toContain(sourceId)
    expect(call[0]).toContain(type)
  })
})

describe("getFromCache", () => {
  it("should return the cached data for the required source and type", () => {
    const data = { correct: true }
    mockGet.mockImplementation((key) => {
      if (key.includes(sourceId) && key.includes(type)) {
        return data
      }
    })

    const result = getFromCache(sourceId, type)

    expect(result).toBe(data)
  })
})

describe("clearCache", () => {
  it("should clear only the specific source if source is provided", () => {
    clearCache(sourceId)

    expect(mockDelete).toBeCalledWith(sourceId)
  })

  it("should clear only the specific type if source and type are provided", () => {
    clearCache(sourceId, type)

    expect(mockDelete).toBeCalledWith(`${sourceId}.${type}`)
  })

  it("should clear the entire cache if no source is provided", () => {
    clearCache()

    expect(mockClear).toBeCalled()

    clearCache(undefined, type)

    expect(mockClear).toBeCalled()
  })
})

describe("isCacheDataValid", () => {
  it("should return false if there is no cached data", () => {
    const result = isCacheDataValid(null, 1, 999)

    expect(result).toBeFalsy()
  })

  it("should return false if the TTL has passed", () => {
    cacheTTLMinutes = 10
    const numOfRequiredItems = 1
    const cachedAt = new Date()
    cachedAt.setMinutes(cachedAt.getMinutes() - cacheTTLMinutes - 1)
    const cacheResult = { cachedAt: cachedAt.getTime(), data: [1] }

    const result = isCacheDataValid(
      cacheResult,
      numOfRequiredItems,
      cacheTTLMinutes
    )

    expect(result).toBeFalsy()
  })

  it("should return false if number of cached items is lower than requested", () => {
    cacheTTLMinutes = 10
    const numOfRequiredItems = 4
    const cacheResult = { cachedAt: Date.now(), data: [1, 2, 3] }

    const result = isCacheDataValid(
      cacheResult,
      numOfRequiredItems,
      cacheTTLMinutes
    )

    expect(result).toBeFalsy()
  })

  it("should return true otherwise", () => {
    cacheTTLMinutes = 10
    const numOfRequiredItems = 3
    const cacheResult = { cachedAt: Date.now(), data: [1, 2, 3, 4, 5] }

    const result = isCacheDataValid(
      cacheResult,
      numOfRequiredItems,
      cacheTTLMinutes
    )

    expect(result).toBeTruthy()
  })
})
