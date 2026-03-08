const LoginForm = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        username{' '}
        <input
          aria-label="username"
          value={username}
          onChange={onUsernameChange}
          autoComplete="username"
        />
      </div>
      <div>
        password{' '}
        <input
          type="password"
          aria-label="password"
          value={password}
          onChange={onPasswordChange}
          autoComplete="current-password"
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm

