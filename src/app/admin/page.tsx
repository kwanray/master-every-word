import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import AdminTable, { AdminUser } from '@/components/admin/AdminTable'

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (myProfile?.role !== 'admin') redirect('/dashboard')

  const serviceClient = createServiceClient()

  // Fetch all auth users to get emails
  const allAuthUsers: { id: string; email: string }[] = []
  let page = 1
  while (true) {
    const { data: list } = await serviceClient.auth.admin.listUsers({ page, perPage: 1000 })
    if (!list?.users.length) break
    allAuthUsers.push(...list.users.map(u => ({ id: u.id, email: u.email ?? '' })))
    if (list.users.length < 1000) break
    page++
  }

  // Fetch all non-admin profiles
  const { data: profiles } = await serviceClient
    .from('profiles')
    .select('id, name, role, linked_student_id')
    .in('role', ['parent', 'student'])
    .order('name')

  const emailMap = Object.fromEntries(allAuthUsers.map(u => [u.id, u.email]))

  const users: AdminUser[] = (profiles ?? []).map(p => ({
    id: p.id,
    name: p.name,
    email: emailMap[p.id] ?? '',
    role: p.role,
    linked_student_id: p.linked_student_id,
  }))

  const parents = users.filter(u => u.role === 'parent')
  const students = users.filter(u => u.role === 'student')

  const linkedCount = parents.filter(p => p.linked_student_id).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">管理面板</h1>
          <p className="text-xs text-gray-400 mt-0.5">字字通 Admin</p>
        </div>
        <a
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 返回应用
        </a>
      </header>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-4">
        {[
          { label: '家长账户', value: parents.length, color: 'text-brand-600' },
          { label: '学生账户', value: students.length, color: 'text-emerald-600' },
          { label: '已关联对数', value: linkedCount, color: 'text-violet-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <main className="max-w-5xl mx-auto px-6 pb-12">
        <AdminTable parents={parents} students={students} />
      </main>
    </div>
  )
}
