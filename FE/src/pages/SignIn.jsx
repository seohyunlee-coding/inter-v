import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../partials/Header';
import PageIllustration from '../partials/PageIllustration';
import Banner from '../partials/Banner';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const userRef = useRef(null);

  // 로그인 상태 확인 (새로고침 시에도 유지)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setToken(token);
    }
  }, []);

  // 바깥 클릭 시 로그아웃 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    }
    if (showLogout) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('https://api.interv.swote.dev/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('로그인 실패');

      const data = await res.json();
      console.log('로그인 응답 전체 데이터:', data);  // 전체 응답 데이터 확인
      console.log('로그인 응답 data 필드:', data.data);  // data 필드 확인

      const loginData = data.data; // ← 실제 로그인 정보
      console.log('loginData 구조:', loginData);  // loginData 구조 확인

      // 토큰, 사용자 ID, 이메일 저장
      localStorage.setItem('token', loginData.accessToken);
      localStorage.setItem('userId', loginData.user.id);
      localStorage.setItem('userEmail', email);

      console.log('localStorage에서 id:', localStorage.getItem('token'));
      console.log('localStorage에서 token:', localStorage.getItem('token'));  // 저장 후 확인

      setIsLoggedIn(true);
      setUserId(loginData.user.id);
      setError('');
      // 로그인 성공 후
      navigate('/'); // 메인 화면으로 이동
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('https://api.interv.swote.dev/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'accept': '*/*',
        },
      });
      if (res.ok) {
        // 로컬 스토리지에서 토큰, 사용자 ID, 이메일 제거
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');

        setIsLoggedIn(false);
        setUserId('');
        alert('로그아웃 되었습니다.');
        navigate('/signin');
      }
    } catch (err) {
      alert('로그아웃에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/*  Site header */}
      <Header
        isLoggedIn={isLoggedIn}
        userEmail={userId}
        onLogout={handleLogout}
      />

      {/*  Page content */}
      <main className="grow">

        {/*  Page illustration */}
        <div className="relative max-w-6xl mx-auto h-0 pointer-events-none" aria-hidden="true">
          <PageIllustration />
        </div>

        <section className="relative">
          <div className=" mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">

              {/* Page header */}
              <div className="w-[38%] mx-auto text-left pb-12 md:pb-20">
                <h1 className="h2">로그인 한 번으로 <br /> INTERV의 서비스를 사용해보세요</h1>
              </div>

              {/* Form or User Info */}
              <div className="w-[30%] mx-auto">
                {!isLoggedIn ? (
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">Email</label>
                        <input
                          id="email"
                          type="email"
                          className="form-input w-full text-gray-300"
                          placeholder="이메일 주소"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">비밀번호</label>
                        <input
                          id="password"
                          type="password"
                          className="form-input w-full text-gray-300"
                          placeholder="비밀번호"
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <div className="flex justify-between">
                          <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox" />
                            <span className="text-gray-400 ml-2">로그인 유지</span>
                          </label>

                        </div>
                      </div>
                    </div>
                    {error && (
                      <div className="text-red-500 text-sm mb-2">{error}</div>
                    )}
                    <div className="flex flex-wrap -mx-3 mt-6">
                      <div className="w-full px-3">
                        <button className="btn text-white bg-purple-600 hover:bg-purple-700 w-full" type="submit">로그인</button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center">
                    <div
                      ref={userRef}
                      className="relative cursor-pointer text-white bg-purple-600 rounded px-4 py-2 w-full text-center"
                      onClick={() => setShowLogout((prev) => !prev)}
                    >
                      {userId}
                      {showLogout && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border rounded shadow-lg z-10 w-32">
                          <button
                            className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-center"
                            onClick={handleLogout}
                          >
                            로그아웃
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {!isLoggedIn && (
                  <div className="text-gray-400 text-center mt-6">
                    계정이 없으세요? <Link to="/signup" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">회원가입</Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>

    </div>
  );
}

export default SignIn;