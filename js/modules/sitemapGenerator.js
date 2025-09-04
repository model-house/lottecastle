// Sitemap Generator Module
export class SitemapGenerator {
    constructor() {
        // 저장된 도메인 사용, 없으면 현재 도메인
        this.baseUrl = window.siteData?.site?.domain || window.location.origin;
        
        // URL 형식 정규화 (https:// 추가)
        if (this.baseUrl && !this.baseUrl.startsWith('http')) {
            this.baseUrl = 'https://' + this.baseUrl;
        }
        
        // 말단 슬래시 제거
        this.baseUrl = this.baseUrl.replace(/\/$/, '');
        
        this.sections = [
            { path: '', priority: '1.0', name: 'main' },
            { path: '#overview', priority: '0.8', name: 'overview' },
            { path: '#location', priority: '0.8', name: 'location' },
            { path: '#floorplans', priority: '0.8', name: 'floorplans' },
            { path: '#premium', priority: '0.7', name: 'premium' },
            { path: '#convenience', priority: '0.7', name: 'convenience' },
            { path: '#community', priority: '0.7', name: 'community' },
            { path: '#contact', priority: '0.9', name: 'contact' }
        ];
    }

    generateSitemapXML() {
        const today = new Date().toISOString().split('T')[0];
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // 각 섹션에 대한 URL 생성
        this.sections.forEach(section => {
            xml += `
    <url>
        <loc>${this.baseUrl}/${section.path}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${section.priority}</priority>
    </url>`;
        });

        xml += `
</urlset>`;

        return xml;
    }

    generateRobotsTxt() {
        const robotsTxt = `# robots.txt for ${window.siteData?.site?.title || '김포 오퍼스 한강 스위첸'}
# Generated: ${new Date().toISOString().split('T')[0]}
# Domain: ${this.baseUrl}

# 모든 검색엔진 봇 허용
User-agent: *

# 크롤링 허용
Allow: /

# 관리자 페이지 제외
Disallow: /admin/
Disallow: /admin

# 데이터 폴더 제외
Disallow: /data/
Disallow: /api/

# CSS 및 이미지는 허용 (검색엔진이 페이지를 올바르게 렌더링하도록)
Allow: /css/
Allow: /assets/
Allow: /*.css$
Allow: /*.js$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.webp$

# 크롤링 속도 제한 (선택적 - 서버 부하 방지)
Crawl-delay: 1

# 사이트맵 위치
Sitemap: ${this.baseUrl}/sitemap.xml

# 주요 검색엔진별 설정
# Googlebot
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /data/
Crawl-delay: 0

# Naver Yeti
User-agent: Yeti
Allow: /
Disallow: /admin/
Disallow: /data/
Crawl-delay: 0

# Daum
User-agent: Daumoa
Allow: /
Disallow: /admin/
Disallow: /data/

# Bing
User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /data/
Crawl-delay: 1

# 이미지 크롤링 허용 (이미지 검색 최적화)
User-agent: Googlebot-Image
Allow: /assets/images/
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.gif$
Allow: /*.webp$

# 모바일 검색 최적화
User-agent: Googlebot-Mobile
Allow: /`;

        return robotsTxt;
    }

    // 다운로드 함수
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // sitemap.xml 다운로드
    downloadSitemap() {
        const xml = this.generateSitemapXML();
        this.downloadFile(xml, 'sitemap.xml', 'application/xml');
    }

    // robots.txt 다운로드
    downloadRobotsTxt() {
        const txt = this.generateRobotsTxt();
        this.downloadFile(txt, 'robots.txt', 'text/plain');
    }

    // 두 파일 모두 다운로드
    downloadBoth() {
        this.downloadSitemap();
        setTimeout(() => {
            this.downloadRobotsTxt();
        }, 500); // 브라우저가 두 다운로드를 처리할 수 있도록 약간의 딜레이
    }

    // 미리보기 생성
    getPreview() {
        return {
            sitemap: this.generateSitemapXML(),
            robots: this.generateRobotsTxt()
        };
    }
}

// 전역으로 사용할 수 있도록 설정
window.SitemapGenerator = SitemapGenerator;