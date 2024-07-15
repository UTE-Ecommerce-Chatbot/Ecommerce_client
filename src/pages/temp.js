export default function LoginPage(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
  
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    useEffect(() => {
      document.title = "Đăng nhập ";
  
      let isAuth = localStorage.getItem("token");
      if (isAuth && isAuth !== "undefined") {
        props.history.goBack();
      }
    }, [props.history]);
  
    const handleRedirectGoogle = () => {
      // window.location.href = LOGIN_URL_GOOGLE;
      // window.open(LOGIN_URL_GOOGLE);
      window.open(LOGIN_URL_GOOGLE, "_self", "").close();
    };
  
    const handleRedirectFacebook = () => {
      window.location.href = LOGIN_URL_FACEBOOK;
    };
  
    const handleRedirectZalo = () => {
      window.location.href = LOGIN_URL_ZALO;
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const data = {
        username,
        password,
      };
      dispatch(login(data, history));
      // dispatch(login(data));
    };
    return (


export default function RegisterPage(props) {

    const dispatch = useDispatch();

    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")

    useEffect(() => {

        document.title = "Đăng ký tài khoản"

        let isAuth = localStorage.getItem('token')
        if (isAuth && isAuth !== 'undefined') {
            props.history.push('/')
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            fullName, phone, email, username, password, dateOfBirth
        }
        dispatch(register(data, props.history));
    }
    return 