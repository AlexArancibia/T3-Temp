FROM oven/bun:1

WORKDIR /app

# Configure npm registry for better reliability
RUN bun config set registry https://registry.npmjs.org/

COPY package.json bun.lock ./

# Install dependencies with retry logic
RUN for i in 1 2 3; do \
    bun install --no-cache --verbose && break || \
    (echo "Attempt $i failed, retrying..." && sleep 10); \
    done

COPY . .

EXPOSE 3000
CMD ["bun", "run", "dev"]
