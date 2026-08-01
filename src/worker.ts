type AssetsBinding = {
  fetch(request: Request): Promise<Response>
}

type Env = {
  ASSETS: AssetsBinding
}

export default {
  fetch(request: Request, env: Env) {
    return env.ASSETS.fetch(request)
  },
}
