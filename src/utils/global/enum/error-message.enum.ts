

export enum UserErrorID {
    IncorrectAuth = "Email atau kata sandi salah",
    AccountNotExist = "Akun tidak ditemukan",
    AccountAlreadyExist = "Akun sudah terdaftar",
    NotFound = "Pengguna tidak ditemukan",
    TokenNotFound = "Token tidak ditemukan",
    InactiveUser = "Pengguna sudah tidak aktif atau sudah dihapus",
    OldPasswordSame = "Kata sandi yang baru tidak dapat sama dengan yang lama",
    DeactiveFailed = "Gagal dalam menonaktifkan akun. ",
    UserAlreadyActivated = "Pengguna sudah dalam status aktif",
    RestoreFailed = "Gagal dalam mengaktifkan kembali akun.",
    DeleteFailed = "Gagal dalam menghapus akun",
    PasswordChangeFailed = "Gagal dalam mengubah kata sandi",
    PasswordRequirement = "Kata sandi harus terdapat minimal 1 huruf kecil, angka atau simbol"
}

export enum DataErrorID {
    NotFound = "Data tidak ditemukan",
    UpdateFailed = "Gagal dalam memperbarui data"
}