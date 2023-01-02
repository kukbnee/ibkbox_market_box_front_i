import axios from 'axios'
import API from 'modules/constants/API'

const Axios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 300000
})

Axios.interceptors.request.use(
  function (config) {

      //
      InterceptorsCheck({act : "request", url : config.url});

      //시작
      refreshTimer();

      const token = localStorage.getItem('token') === null ? '' : localStorage.getItem('token')
      config.headers['Authorization'] = `Bearer ${token}`
      // config.headers['Authorization'] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJib3gxNDYwMSIsIlVUTElOU1RUSUQiOiJDMDAwMDE1MSIsIlVTRVJJRCI6ImJveDE0NjAxIiwiZXhwIjoxNjYxMTAzMTQxLCJpYXQiOjE2NjAyMDMxNDF9.KWTaseuBZ5doPKmAP_Ty4XGphLoR332RSevbwlryOK4`
      config.headers['Content-Type'] = config?.fileUpload ? 'multipart/form-data' : 'application/json; charset=utf-8'
      return config
  },
  function (error) {
      return Promise.reject(error)
  }
)

Axios.interceptors.response.use(
  (response) => {
     InterceptorsCheck({act : "response", url : response.config.url});
     return response;
  },
  (error) => {
    return Promise.reject(error)
  }
)

const InterceptorsCheck = ({act, url}) => {



    if(act == "request"){
        // console.log("request---->",API.AxiosInterceptors);
        API.AxiosInterceptors.push(url);

        if(API.AxiosInterceptors.length > 0){
            document.querySelector('#loadingstate').style.display = 'flex';
        }
    }else if(act == "response"){
        API.AxiosInterceptors = API.AxiosInterceptors.filter((data) => data != url);
        // console.log("response--->",API.AxiosInterceptors, "len--->",API.AxiosInterceptors.length);
        if(API.AxiosInterceptors.length == 0){
            document.querySelector('#loadingstate').style.display = 'none';
            if(API.refreshCheck) {
                API.refreshCheck = false;
                refreshToken();
            }
        }
    }
}

//컴포넌트가 랜더링 될때마다, 타이머가 생성되는 문제로 인하여 API 파일에 object 및 변수를 담아서 사용
const refreshTimer = () => {

    //로그인 후 부터는 카운트 증가로 세션 연결시간을 체크 하기 위함
    API.TIMERCNT = 0;

    //로그인 후 발생하는 상황
    if(localStorage.getItem('token')) {
        //타이머 시작
        if (API.TIMEROBJ == null) {
            API.TIMEROBJ = setInterval(() => {
                if (API.TIMERCNT == API.LIMITCNT) {
                    sessionInit();
                }
                API.TIMERCNT++;
                // console.log("로그인 세션 종료까지 남은 시간 --->", API.TIMERCNT, "/", API.LIMITCNT, "=", (API.LIMITCNT / 60), "분");
            }, 1000);
        }
    }
}

//토큰 갱신
const refreshToken = () =>{

    //로그인 후 발생하는 상황
    if(localStorage.getItem('token')) {
        Axios({
            method: 'get',
            url: API.LOGIN.JWT_CHECK
        }).then((response) => {
            if (response?.data.token) {
                API.refreshCheck = true;
                localStorage.setItem("token", response?.data.token);
                localStorage.setItem("type", response?.data.data);
            } else {
                API.refreshCheck = true;
                localStorage.removeItem("token");
                localStorage.removeItem("type");
                alert('로그인 세션이 만료되었습니다');
                window.location.href="/";
            }
        }).catch(() => {
            API.refreshCheck = true;
            localStorage.removeItem("token");
            localStorage.removeItem("type");
            alert('로그인 세션이 만료되었습니다');
            window.location.href="/";
        })
    }
}

//세션 초기화
const sessionInit = () =>{
    console.log('로그인 세션이 만료 혹은 갱신에 실패하였습니다.');
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    window.location.href="/";
}
export default Axios
