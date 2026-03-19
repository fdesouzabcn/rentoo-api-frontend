import { useState, useEffect, useCallback } from 'react'

/**
 * Generic data-fetching hook.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(fetchFn, [dep1, dep2])
 *
 * @param {Function} fetchFn  — async function that returns data
 * @param {Array}    deps     — re-fetch when these change (like useEffect deps)
 * @param {boolean}  skip     — set true to skip the initial fetch (useful for
 *                              forms that only fetch on demand)
 */
export function useApi(fetchFn, deps = [], { skip = false } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    if (!skip) {
      execute()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute])

  return { data, loading, error, refetch: execute }
}

export default useApi
