import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET() {
    try {
        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('email', { ascending: true })

        if (error) throw error
        return NextResponse.json({ users })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { email, password, role } = await request.json()

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true
        })

        if (authError) throw authError

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ role: role })
            .eq('id', authData.user.id)

        if (profileError) throw profileError

        return NextResponse.json({ success: true, message: 'Akun berhasil dibuat!' })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, role, password } = await request.json()

        if (password) {
            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { password })
            if (authError) throw authError
        }

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ role: role })
            .eq('id', id)

        if (profileError) throw profileError

        return NextResponse.json({ success: true, message: 'Data akun berhasil diperbarui!' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) throw new Error('ID Pengguna tidak ditemukan')

        const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
        if (error) throw error

        return NextResponse.json({ success: true, message: 'Akun berhasil dihapus!' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}