create_env_sh() {
  cat << END > env.sh
# Define your environment variables here

\$*
END

  chmod a+x env.sh
}

ensure_env_sh() {
  if [ ! -x env.sh ]; then
    create_env_sh
  fi
}
