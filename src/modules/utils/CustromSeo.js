export const createHeaderSeo = (custrom_data) => {
/*
    <meta name="og:type" content="website" />
    <meta name="og:site_name" content="사이트 제목" />

    <meta name="og:title" content="메타 태그를 통한 검색엔진 최적화" />
    <meta name="og:description" content="메타 태그 내용"/>
    <meta name="og:url" content="https://xxxx" />
    <meta name="og:image" content="https://xxxx.png"/>

    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="메타 태그를 통한 검색엔진 최적화">
    <meta name="twitter:description" content="메타 태그 내용"/>
    <meta name="twitter:image" content="https://xxxx.png"/>


    [
        {
            name : "og:title",
            content : ""
        },
        {
            name : "og:description",
            content : ""
        },
        {
            name : "og:url",
            content : ""
        },
        {
            name : "og:image",
            content : ""
        },
        {
            name : "twitter:title",
            content : ""
        },
        {
            name : "twitter:description",
            content : ""
        },
        {
            name : "twitter:image",
            content : ""
        }
    ]
 */

    //초기화
    let og_meta = document.querySelectorAll('meta[name*="og"]');
    for (let i = 0; i < og_meta.length; i++) { og_meta[i].remove(); }

    let twitter_meta = document.querySelectorAll('meta[name*="twitter"]');
    for (let i = 0; i < twitter_meta.length; i++) { twitter_meta[i].remove(); }

    //기본 meta 설정
    let create_meta = [
        {
            name : "og:type",
            content : "website"
        },
        {
            name : "og:site_name",
            content : "커머스BOX"
        },
        {
            name : "twitter:card",
            content : "summary"
        }
    ]

    //페이지에서 전달 받은 추가 meta 설정
    for (let i = 0; i < custrom_data.length; i++) {
        create_meta.push(custrom_data[i]);
    }

    //meta 생성
    for (let i = 0; i < create_meta.length; i++) {
        var meta = document.createElement('meta');
        meta.setAttribute('property', create_meta[i].name);
        meta.content = create_meta[i].content;

        //<head>태그 제일 앞에 meta태그 붙이기
        document.getElementsByTagName('head')[0].prepend(meta);
    }

}