export function normalizeUserId(value) {
  return value.trim().toUpperCase()
}

export function validateUserId(value) {
  const userId = normalizeUserId(value)
  if (!userId) {
    return 'User ID is required'
  }
  if (userId.length < 3) {
    return 'User ID must be at least 3 characters'
  }
  if (userId.length > 20) {
    return 'User ID must be 20 characters or less'
  }
  if (!/^[A-Z0-9]+$/.test(userId)) {
    return 'User ID can only contain letters and numbers'
  }
  return null
}
