# Установка переменных среды в Linux, Windows и macOS

## Linux & macOS (Bash/Zsh)

### Временная установка (только для текущей сессии терминала)

```sh
export DATABASE_URL="file:$(pwd)/prisma/dev.db"
export JWT_ACCESS_SECRET="SUPER_SECRET_JWT_ACCESS"
export JWT_REFRESH_SECRET="SUPER_SECRET_JWT_REFRESH"
```

### Постоянная установка (добавить в `~/.bashrc`, `~/.bash_profile` или `~/.zshrc`)

```sh
echo 'export DATABASE_URL="file:$(pwd)/prisma/dev.db"' >> ~/.bashrc
echo 'export JWT_ACCESS_SECRET="SUPER_SECRET_JWT_ACCESS"' >> ~/.bashrc
echo 'export JWT_REFRESH_SECRET="SUPER_SECRET_JWT_REFRESH"' >> ~/.bashrc
source ~/.bashrc  # Применить изменения
```

_(Для `zsh` замените `~/.bashrc` на `~/.zshrc`.)_

---

## Windows (Command Prompt - cmd)

### Временная установка (только для текущей сессии терминала)

```cmd
set DATABASE_URL=file:%CD%\prisma\dev.db
set JWT_ACCESS_SECRET=SUPER_SECRET_JWT_ACCESS
set JWT_REFRESH_SECRET=SUPER_SECRET_JWT_REFRESH
```

### Постоянная установка (в системных переменных)

```cmd
setx DATABASE_URL "file:%CD%\prisma\dev.db"
setx JWT_ACCESS_SECRET "SUPER_SECRET_JWT_ACCESS"
setx JWT_REFRESH_SECRET "SUPER_SECRET_JWT_REFRESH"
```

_(После этого перезапустите терминал.)_

---

## Windows (PowerShell)

### Временная установка

```powershell
$env:DATABASE_URL="file:$(Get-Location)\prisma\dev.db"
$env:JWT_ACCESS_SECRET="SUPER_SECRET_JWT_ACCESS"
$env:JWT_REFRESH_SECRET="SUPER_SECRET_JWT_REFRESH"
```

### Постоянная установка

```powershell
[System.Environment]::SetEnvironmentVariable("DATABASE_URL", "file:$(Get-Location)\prisma\dev.db", "User")
[System.Environment]::SetEnvironmentVariable("JWT_ACCESS_SECRET", "SUPER_SECRET_JWT_ACCESS", "User")
[System.Environment]::SetEnvironmentVariable("JWT_REFRESH_SECRET", "SUPER_SECRET_JWT_REFRESH", "User")
```

_(Перезапустите PowerShell, чтобы изменения вступили в силу.)_

Если нужно задать переменные на уровне всей системы (не только для текущего пользователя), замените `"User"` на `"Machine"` (требуются права администратора).
