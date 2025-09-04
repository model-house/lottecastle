// Image Click Handler Module - 모바일 및 PC에서 이미지 클릭 처리
export class ImageClickHandler {
    constructor() {
        this.imageSelectors = [
            '.location-image-container',
            '.community-main-display',
            '.community-sub-display',
            '.premium-image-item',
            '#main-floorplan-image',
            '.gallery-main img'
        ];
        this.isScrolling = false;
    }

    init() {
        // DOM이 완전히 로드된 후에 실행
        this.setupImageClickHandlers();
        
        // 동적으로 추가되는 이미지를 위한 이벤트 위임
        this.setupDelegatedHandlers();
    }

    setupImageClickHandlers() {
        // 모든 이미지 선택자에 대해 이벤트 리스너 추가
        this.imageSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 기존 onclick 속성 제거
                element.removeAttribute('onclick');
                
                // 이미지 소스 찾기
                let imgSrc = '';
                if (element.tagName === 'IMG') {
                    imgSrc = element.src;
                } else {
                    const img = element.querySelector('img');
                    if (img) {
                        imgSrc = img.src;
                    }
                }
                
                if (imgSrc) {
                    // 터치 이벤트와 클릭 이벤트 모두 처리
                    element.style.cursor = 'pointer';
                    
                    // 클릭 이벤트
                    element.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.openImage(imgSrc);
                    });
                    
                    // 터치 이벤트 (모바일) - passive: true로 변경하여 스크롤 허용
                    element.addEventListener('touchend', (e) => {
                        // 스크롤 중이라면 무시
                        if (this.isScrolling) {
                            this.isScrolling = false;
                            return;
                        }
                        this.openImage(imgSrc);
                    });
                    
                    // 스크롤 감지
                    let touchStartY = 0;
                    element.addEventListener('touchstart', (e) => {
                        touchStartY = e.touches[0].clientY;
                    });
                    
                    element.addEventListener('touchmove', (e) => {
                        const touchMoveY = e.touches[0].clientY;
                        if (Math.abs(touchMoveY - touchStartY) > 10) {
                            this.isScrolling = true;
                        }
                    });
                }
            });
        });
    }

    setupDelegatedHandlers() {
        // 동적으로 추가되는 요소를 위한 이벤트 위임
        document.body.addEventListener('click', (e) => {
            // 클릭된 요소가 이미지 컨테이너인지 확인
            const clickableContainer = e.target.closest('.location-image-container, .community-main-display, .community-sub-display, .premium-image-item, .gallery-main');
            
            if (clickableContainer) {
                e.preventDefault();
                e.stopPropagation();
                
                const img = clickableContainer.querySelector('img');
                if (img && img.src) {
                    this.openImage(img.src);
                }
            }
        });
        
        // 모바일을 위한 터치 이벤트 위임
        let touchStartY = 0;
        
        document.body.addEventListener('touchstart', (e) => {
            const clickableContainer = e.target.closest('.location-image-container, .community-main-display, .community-sub-display, .premium-image-item, .gallery-main');
            if (clickableContainer) {
                touchStartY = e.touches[0].clientY;
                this.isScrolling = false;
            }
        });
        
        document.body.addEventListener('touchmove', (e) => {
            if (touchStartY && Math.abs(e.touches[0].clientY - touchStartY) > 10) {
                this.isScrolling = true;
            }
        });
        
        document.body.addEventListener('touchend', (e) => {
            const clickableContainer = e.target.closest('.location-image-container, .community-main-display, .community-sub-display, .premium-image-item, .gallery-main');
            
            if (clickableContainer && !this.isScrolling) {
                const img = clickableContainer.querySelector('img');
                if (img && img.src) {
                    this.openImage(img.src);
                }
            }
            
            touchStartY = 0;
            this.isScrolling = false;
        });
    }

    openImage(imageSrc) {
        if (!imageSrc) return;
        
        // ImageViewer가 있으면 사용, 없으면 기본 방식 사용
        if (window.openImageViewer) {
            window.openImageViewer(imageSrc);
        } else if (window.openImageOverlay) {
            window.openImageOverlay(imageSrc);
        } else {
            // 폴백: 새 창으로 이미지 열기
            window.open(imageSrc, '_blank');
        }
    }
}

// 전역 인스턴스 생성
const imageClickHandler = new ImageClickHandler();

export default imageClickHandler;