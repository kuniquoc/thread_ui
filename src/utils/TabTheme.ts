import { createTheme } from 'flowbite-react';

// Theme tùy chỉnh
const tabTheme = createTheme({
	tab: {
		// Class cơ bản cho toàn bộ thành phần tab
		base: 'flex flex-col gap-2 border-none',
		tablist: {
			// Class cơ bản cho danh sách các tab
			base: 'flex text-center border-b border-gray-200',
			styles: {
				// Các kiểu có thể áp dụng cho tablist
				default: '', // Để trống nếu không tùy chỉnh
				underline: 'flex-wrap', // Tùy chỉnh của bạn
				pills: '', // Để trống nếu không tùy chỉnh
				fullWidth: '', // Để trống nếu không tùy chỉnh
			},
			tabitem: {
				// Class cơ bản cho từng tab item
				base: 'flex items-center justify-center px-4 pt-0 pb-2 rounded-none text-sm font-medium first:ml-0 focus:ring-0 focus:outline-none',
				styles: {
					// Các kiểu cho tabitem
					default: {
						base: '', // Để trống nếu không tùy chỉnh
						active: {
							on: '', // Để trống nếu không tùy chỉnh
							off: '', // Để trống nếu không tùy chỉnh
						},
					},
					underline: {
						base: 'rounded-none', // Tùy chỉnh của bạn
						active: {
							on: 'text-gray-200 rounded-none border-b border-gray-200 active', // Tùy chỉnh của bạn
							off: 'border-b border-transparent text-[#666]', // Tùy chỉnh của bạn
						},
					},
					pills: {
						base: '', // Để trống nếu không tùy chỉnh
						active: {
							on: '', // Để trống nếu không tùy chỉnh
							off: '', // Để trống nếu không tùy chỉnh
						},
					},
					fullWidth: {
						base: '', // Để trống nếu không tùy chỉnh
						active: {
							on: '', // Để trống nếu không tùy chỉnh
							off: '', // Để trống nếu không tùy chỉnh
						},
					},
				},
			},
		},
		// Class cho panel chứa nội dung của tab
		tabpanel: 'py-1',
	},
});

export default tabTheme;