import toast from 'react-hot-toast'

export function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast[type](message, {
    position: 'bottom-center',
    style: {
      background: type === 'success' ? '#2d6a4f' : '#dc2626',
      color: '#f5f0eb',
      borderRadius: '4px',
      fontSize: '14px',
    },
    duration: 3000,
  })
}
