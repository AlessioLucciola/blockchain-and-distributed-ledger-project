interface IconProps {
	className?: string
	fill?: string
}

export function RetailerIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height="16" width="20" viewBox="0 0 640 512" className={className}>
			<path
				opacity="1"
				d="M36.8 192H603.2c20.3 0 36.8-16.5 36.8-36.8c0-7.3-2.2-14.4-6.2-20.4L558.2 21.4C549.3 8 534.4 0 518.3 0H121.7c-16 0-31 8-39.9 21.4L6.2 134.7c-4 6.1-6.2 13.2-6.2 20.4C0 175.5 16.5 192 36.8 192zM64 224V384v80c0 26.5 21.5 48 48 48H336c26.5 0 48-21.5 48-48V384 224H320V384H128V224H64zm448 0V480c0 17.7 14.3 32 32 32s32-14.3 32-32V224H512z"
			/>
		</svg>
	)
}

export function ManufacturerIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512" className={className}>
			<path
				opacity="1"
				d="M64 32C46.3 32 32 46.3 32 64V304v48 80c0 26.5 21.5 48 48 48H496c26.5 0 48-21.5 48-48V304 152.2c0-18.2-19.4-29.7-35.4-21.1L352 215.4V152.2c0-18.2-19.4-29.7-35.4-21.1L160 215.4V64c0-17.7-14.3-32-32-32H64z"
			/>
		</svg>
	)
}

export function DistributorIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height="16" width="20" viewBox="0 0 640 512" className={className}>
			<path
				opacity="1"
				d="M0 48C0 21.5 21.5 0 48 0H336c26.5 0 48 21.5 48 48V232.2c-39.1 32.3-64 81.1-64 135.8c0 49.5 20.4 94.2 53.3 126.2C364.5 505.1 351.1 512 336 512H240V432c0-26.5-21.5-48-48-48s-48 21.5-48 48v80H48c-26.5 0-48-21.5-48-48V48zM80 224c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H80zm80 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm112-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H272zM64 112v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zM176 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H176zm80 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H272c-8.8 0-16 7.2-16 16zm96 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm140.7-67.3c-6.2 6.2-6.2 16.4 0 22.6L521.4 352H432c-8.8 0-16 7.2-16 16s7.2 16 16 16h89.4l-28.7 28.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l56-56c6.2-6.2 6.2-16.4 0-22.6l-56-56c-6.2-6.2-16.4-6.2-22.6 0z"
			/>
		</svg>
	)
}

export function CustomerIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512" className={className}>
			<path
				opacity="1"
				d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
			/>
		</svg>
	)
}

export function RightCaretIcon({ className }: IconProps) {
	return (
		<svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
			<path d="M5.79433 3.77124C6.06777 3.97321 6.06777 4.30121 5.79433 4.50318L1.59433 7.60545C1.32089 7.80742 0.876831 7.80742 0.603394 7.60545C0.329956 7.40348 0.329956 7.07548 0.603394 6.87351L4.30902 4.1364L0.605581 1.39929C0.332144 1.19732 0.332144 0.869318 0.605581 0.667347C0.879019 0.465376 1.32308 0.465376 1.59652 0.667347L5.79652 3.76962L5.79433 3.77124Z" />
		</svg>
	)
}

export function SearchIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" className={className}>
			<path
				opacity="1"
				d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
			/>
		</svg>
	)
}
