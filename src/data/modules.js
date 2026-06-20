export const modulesData = [
  {
    id: "1",
    title: "Apa Itu Investasi?",
    description: "Pahami dasar-dasar investasi dan mengapa ini penting untuk masa depan.",
    duration: "10 Min",
    status: "completed",
    progress: 100,
    icon: "psychology",
    isNew: false,
    content: [
      "Investasi adalah kegiatan menempatkan uang pada aset tertentu dengan harapan nilainya bertumbuh di masa depan.",
      "Berbeda dari menabung, investasi memiliki potensi keuntungan dan risiko.",
      "Untuk pemula, yang penting bukan langsung mencari keuntungan besar, tetapi memahami konsep dasar dan risiko."
    ],
    keyTakeaway: "Investasi adalah cara mengembangkan uang, tetapi harus dipahami dengan bijak."
  },
  {
    id: "2",
    title: "Menabung vs Investasi",
    description: "Kenali perbedaan utama dan kapan harus menggunakan masing-masing.",
    duration: "15 Min",
    status: "in_progress",
    progress: 60,
    icon: "compare_arrows",
    isNew: false,
    content: [
      "Menabung biasanya bertujuan menyimpan uang agar aman dan mudah digunakan.",
      "Investasi bertujuan mengembangkan nilai uang dalam jangka waktu tertentu.",
      "Keduanya penting, tetapi digunakan untuk tujuan yang berbeda."
    ],
    keyTakeaway: "Menabung cocok untuk kebutuhan dekat, investasi cocok untuk tujuan jangka panjang."
  },
  {
    id: "3",
    title: "Risiko dan Return",
    description: "Pelajari hubungan antara risiko yang diambil dengan potensi keuntungan.",
    duration: "20 Min",
    status: "not_started",
    progress: 0,
    icon: "balance",
    isNew: true,
    content: [
      "Return adalah potensi keuntungan dari investasi.",
      "Risiko adalah kemungkinan hasil investasi tidak sesuai harapan.",
      "Semakin tinggi potensi return, biasanya semakin tinggi juga risikonya."
    ],
    keyTakeaway: "Sebelum investasi, pahami dulu risiko dan jangan hanya melihat keuntungan."
  },
  {
    id: "4",
    title: "Jenis-Jenis Investasi",
    description: "Kenali instrumen investasi seperti reksa dana, saham, dan emas.",
    duration: "15 Min",
    status: "not_started",
    progress: 0,
    icon: "account_balance_wallet",
    isNew: false,
    content: [
      "Emas adalah investasi fisik yang cenderung aman sebagai pelindung nilai (safe haven).",
      "Reksa Dana adalah kumpulan dana dari banyak investor yang dikelola oleh Manajer Investasi.",
      "Saham adalah bukti kepemilikan sebagian kecil dari sebuah perusahaan."
    ],
    keyTakeaway: "Pilihlah instrumen investasi yang paling sesuai dengan profil risiko dan tujuanmu."
  },
  {
    id: "5",
    title: "Tips Investasi Aman",
    description: "Tips penting untuk menghindari penipuan atau investasi bodong.",
    duration: "12 Min",
    status: "not_started",
    progress: 0,
    icon: "shield",
    isNew: false,
    content: [
      "Pastikan perusahaan investasi terdaftar dan diawasi oleh OJK (Otoritas Jasa Keuangan).",
      "Jangan tergiur dengan tawaran keuntungan besar dalam waktu singkat dan tanpa risiko.",
      "Pahami produk investasinya secara mendalam sebelum menaruh uang."
    ],
    keyTakeaway: "Legal dan Logis (2L) adalah kunci utama sebelum memilih investasi."
  }
]

export const quizQuestionsData = {
  "1": [
    {
      text: "Apa tujuan utama dari berinvestasi?",
      options: [
        { text: "Menyimpan uang agar aman di bank", isCorrect: false },
        { text: "Mengembangkan nilai uang di masa depan", isCorrect: true },
        { text: "Menghabiskan uang untuk gaya hidup", isCorrect: false }
      ]
    },
    {
      text: "Berbeda dengan menabung, investasi memiliki hal berikut, yaitu...",
      options: [
        { text: "Potensi keuntungan dan risiko kerugian", isCorrect: true },
        { text: "Jaminan uang pasti bertambah tanpa risiko", isCorrect: false },
        { text: "Kemudahan untuk ditarik kapan saja tanpa batas", isCorrect: false }
      ]
    }
  ],
  "2": [
    {
      text: "Menabung lebih cocok digunakan untuk...",
      options: [
        { text: "Tujuan jangka panjang seperti dana pensiun", isCorrect: false },
        { text: "Membeli saham perusahaan teknologi", isCorrect: false },
        { text: "Kebutuhan mendesak atau jangka pendek", isCorrect: true }
      ]
    },
    {
      text: "Apa perbedaan mendasar antara menabung dan berinvestasi?",
      options: [
        { text: "Menabung hanya menyimpan uang, sedangkan investasi bertujuan menumbuhkan nilai uang", isCorrect: true },
        { text: "Menabung selalu memiliki risiko lebih tinggi dibanding investasi", isCorrect: false },
        { text: "Investasi tidak memiliki keuntungan sama sekali", isCorrect: false }
      ]
    }
  ],
  "3": [
    {
      text: "Bagaimana hubungan antara risiko (risk) dan potensi keuntungan (return)?",
      options: [
        { text: "Semakin tinggi return, semakin tinggi pula risikonya", isCorrect: true },
        { text: "Semakin rendah return, semakin tinggi risikonya", isCorrect: false },
        { text: "Risiko dan return tidak memiliki kaitan sama sekali", isCorrect: false }
      ]
    },
    {
      text: "Jika seseorang menawarkan investasi dengan keuntungan 50% per bulan tanpa risiko, tawaran tersebut...",
      options: [
        { text: "Sangat bagus dan harus segera diikuti", isCorrect: false },
        { text: "Sangat mencurigakan (kemungkinan besar penipuan/bodong)", isCorrect: true },
        { text: "Sangat aman karena dijamin oleh undang-undang", isCorrect: false }
      ]
    }
  ],
  "4": [
    {
      text: "Manakah di bawah ini yang merupakan instrumen investasi fisik?",
      options: [
        { text: "Saham", isCorrect: false },
        { text: "Emas logam mulia", isCorrect: true },
        { text: "Reksa dana pasar uang", isCorrect: false }
      ]
    },
    {
      text: "Siapakah yang mengelola dana investor pada produk Reksa Dana?",
      options: [
        { text: "Manajer Investasi", isCorrect: true },
        { text: "Bank Indonesia", isCorrect: false },
        { text: "Dinas Pendidikan", isCorrect: false }
      ]
    }
  ],
  "5": [
    {
      text: "Apa prinsip '2L' sebelum mulai berinvestasi?",
      options: [
        { text: "Legal dan Logis", isCorrect: true },
        { text: "Lancar dan Langsung", isCorrect: false },
        { text: "Lama dan Loyal", isCorrect: false }
      ]
    },
    {
      text: "Lembaga resmi di Indonesia yang mengawasi aktivitas sektor jasa keuangan adalah...",
      options: [
        { text: "OJK (Otoritas Jasa Keuangan)", isCorrect: true },
        { text: "KPK", isCorrect: false },
        { text: "Kementerian Pemuda dan Olahraga", isCorrect: false }
      ]
    }
  ]
}
