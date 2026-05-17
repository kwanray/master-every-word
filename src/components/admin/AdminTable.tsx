'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface AdminUser {
  id: string
  name: string | null
  email: string
  role: string
  linked_student_id: string | null
}

interface Props {
  parents: AdminUser[]
  students: AdminUser[]
}

export default function AdminTable({ parents, students }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Record<string, string>>({})

  const studentMap = Object.fromEntries(students.map(s => [s.id, s]))

  const changeRole = async (userId: string, newRole: string) => {
    setLoadingId(userId)
    await fetch('/api/admin/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, new_role: newRole }),
    })
    setLoadingId(null)
    router.refresh()
  }

  const link = async (parentId: string) => {
    const studentId = selectedStudent[parentId]
    if (!studentId) return
    setLoadingId(parentId)
    await fetch('/api/admin/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parent_id: parentId, student_id: studentId }),
    })
    setLoadingId(null)
    router.refresh()
  }

  const unlink = async (parentId: string) => {
    setLoadingId(parentId)
    await fetch('/api/admin/link', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parent_id: parentId }),
    })
    setLoadingId(null)
    router.refresh()
  }

  // Build reverse map: student_id → parent(s)
  const studentToParent: Record<string, AdminUser[]> = {}
  for (const p of parents) {
    if (p.linked_student_id) {
      if (!studentToParent[p.linked_student_id]) studentToParent[p.linked_student_id] = []
      studentToParent[p.linked_student_id].push(p)
    }
  }

  const RoleSelect = ({ user }: { user: AdminUser }) => (
    <select
      value={user.role}
      disabled={loadingId === user.id}
      onChange={e => {
        if (window.confirm(`将 ${user.name ?? user.email} 的账户类型改为"${e.target.value === 'parent' ? '家长' : '学生'}"？`)) {
          changeRole(user.id, e.target.value)
        }
      }}
      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-40"
    >
      <option value="student">学生</option>
      <option value="parent">家长</option>
    </select>
  )

  return (
    <div className="flex flex-col gap-10">

      {/* ── Parents ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          家长 <span className="text-sm font-normal text-gray-400">({parents.length})</span>
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">姓名</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">邮箱</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">账户类型</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">关联学生</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parents.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">暂无家长账户</td></tr>
              )}
              {parents.map(parent => {
                const linked = parent.linked_student_id ? studentMap[parent.linked_student_id] : null
                const busy = loadingId === parent.id
                return (
                  <tr key={parent.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {parent.name ?? <span className="text-gray-400 italic">未设置</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{parent.email}</td>
                    <td className="px-4 py-3">
                      <RoleSelect user={parent} />
                    </td>
                    <td className="px-4 py-3">
                      {linked ? (
                        <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                          {linked.name ?? linked.email}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {linked ? (
                        <button
                          onClick={() => unlink(parent.id)}
                          disabled={busy}
                          className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-40 transition-colors"
                        >
                          {busy ? '处理中…' : '解除关联'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedStudent[parent.id] ?? ''}
                            onChange={e => setSelectedStudent(s => ({ ...s, [parent.id]: e.target.value }))}
                            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
                          >
                            <option value="">选择学生…</option>
                            {students.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name ?? s.email}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => link(parent.id)}
                            disabled={busy || !selectedStudent[parent.id]}
                            className="text-xs bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {busy ? '…' : '关联'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Students ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          学生 <span className="text-sm font-normal text-gray-400">({students.length})</span>
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">姓名</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">邮箱</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">账户类型</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">关联家长</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">暂无学生账户</td></tr>
              )}
              {students.map(student => {
                const linkedParents = studentToParent[student.id] ?? []
                return (
                  <tr key={student.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {student.name ?? <span className="text-gray-400 italic">未设置</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{student.email}</td>
                    <td className="px-4 py-3">
                      <RoleSelect user={student} />
                    </td>
                    <td className="px-4 py-3">
                      {linkedParents.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {linkedParents.map(p => (
                            <span key={p.id} className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                              {p.name ?? p.email}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
