function getCookie(key){
    const cookies = document.cookie;
    const cookies_array = cookies.split(';');

    let value = null;

    cookies_array.forEach((element) => {
        const key = element.split('=')[0];
        if(key === key){
            value = decodeURIComponent(element.split('=')[1]);
        }
    });

    return value;
}

function setCookie(key,value,max_age){
    if(typeof max_age === 'undefined') max_age = 30 * 60 //デフォルトで30分間有効
    if(typeof max_age !== 'number') return;
    if(max_age < 0) return;

    cookie_query = `${key}=${encodeURIComponent(value)}; path=/; max-age=${max_age}`;
    document.cookie = cookie_query;
}

function deleteCookie(key){
    setCookie(key,'',0);
}