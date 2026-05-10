'use client'

interface Props {
  title: string | null
  passage: string
  onReady: () => void
}

export default function PassageCard({ title, passage, onReady }: Props) {
  const paragraphs = passage.split('\n\n').filter(Boolean)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-full text-xs">
          阅读理解
        </span>
        <span>请阅读短文，然后回答问题</span>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        {title && (
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center chinese-text">{title}</h2>
        )}
        <div className="flex flex-col gap-3">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-gray-700 chinese-text">
              {para}
            </p>
          ))}
        </div>
      </div>

      <button
        onClick={onReady}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-xl transition-colors text-base"
      >
        我已读完，开始作答 →
      </button>
    </div>
  )
}
