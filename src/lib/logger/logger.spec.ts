import { makeLogger, LOG_LEVELS } from './index.js'
import type { LogLevelsUnion } from './types.js'

const mockConsole = () => {
  const log = LOG_LEVELS.reduce<Record<LogLevelsUnion, jest.SpyInstance>>(
    (acc, level) => {
      const method = jest
        .spyOn(console, level as LogLevelsUnion)
        .mockImplementation()
      acc[level] = method
      return acc
    },
    {} as any
  )

  const restore = () => {
    Object.values(log).map((mock) => mock.mockRestore())
  }

  return { restore, log }
}

describe('Logger', () => {
  test('make logger', () => {
    const logger = makeLogger({ pretty: true, level: 'error' })
    expect(logger).toBeDefined()
  })

  describe('print level', () => {
    test('debug enabled', () => {
      const { restore, log } = mockConsole()
      const logger = makeLogger({ pretty: false, level: 'debug' })

      logger.debug('test')

      expect(log.debug).toHaveBeenCalledTimes(1)

      LOG_LEVELS.filter((level) => level !== 'debug').map((level) =>
        expect(log[level]).toHaveBeenCalledTimes(0)
      )

      restore()
    })

    test('debug disabled', () => {
      const { restore, log } = mockConsole()
      const logger = makeLogger({ pretty: false, level: 'info' })

      logger.debug('test')

      expect(log.debug).toHaveBeenCalledTimes(0)

      LOG_LEVELS.filter((level) => level !== 'debug').map((level) =>
        expect(log[level]).toHaveBeenCalledTimes(0)
      )

      restore()
    })
  })
})
