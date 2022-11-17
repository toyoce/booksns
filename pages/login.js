import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Link from '../src/Link';
import { UserContext } from './_app';

const LoginPage = () => {
  const router = useRouter();
  const { setCurrentUser } = useContext(UserContext);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleIconClick = () => {
    setShowPassword(!showPassword);
  };

  const login = async () => {
    if (!userId) {
      setErrorMessage("ユーザーIDを入力してください");
      return;
    }
    if (!password) {
      setErrorMessage("パスワードを入力してください");
      return;
    }
    setErrorMessage("");
    setProcessing(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/login`,
        {
          user_id: userId,
          password
        },
        { withCredentials: true }
      );
      setCurrentUser({"userId": userId});
      router.push("/");
    } catch (error) {
      if (error.response && error.response.status == 401) {
        setErrorMessage("ユーザーIDまたはパスワードが間違っています");
      } else {
        setErrorMessage("エラーにより、ログインに失敗しました");
      }
      setProcessing(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      login();
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h6" sx={{ mt: 4 }}>
        Booksnsへようこそ
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 4 }}>
        ユーザーID
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={userId}
        onChange={handleUserIdChange}
      />
      <Typography variant="subtitle2" sx={{ mt: 4 }}>
        パスワード
      </Typography>
      <TextField
        fullWidth
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleIconClick}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={handlePasswordChange}
        onKeyDown={handleKeyDown}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 5 }}
        onClick={login}
        disabled={processing}
      >
        {processing ? "ログイン中.." : "ログイン"}
      </Button>
      <Typography
        variant="body2"
        sx={{ mt: 2, color: "error.light" }}
      >
        {errorMessage}
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Link
          variant="body2"
          color="common.black"
          underline="hover"
          href="/register"
        >
          アカウントをお持ちでない方はこちら
        </Link>
      </Box>
    </Container>
  );
};

export default LoginPage;