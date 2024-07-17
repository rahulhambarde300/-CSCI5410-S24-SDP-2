import React, { createContext, useEffect, useState } from 'react';
import { CognitoUserPool, AuthenticationDetails, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import axios from 'axios';
import { clientId, userPoolId } from '../config';
import { USER_SIGNUP, VERIFY_USER } from '../API_URL';;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);

  const poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId
  };

  const userPool = new CognitoUserPool(poolData);

  useEffect(()=>{
    const userPresent = localStorage.getItem('user')
    console.log("Inside Auth Context")
    console.log("USER ---->", userPresent)
    if(userPresent){
      setUser(JSON.parse(userPresent))
      setAuthCompleted(JSON.parse(userPresent)?.authCompleted)
    }
  },[])
  const loginUserCred = async (userData) => {
    setLoading(true);
    setError(null);

    const authenticationDetails = new AuthenticationDetails({
      Username: userData.email,
      Password: userData.password,
    });

    const cognitoUser = new CognitoUser({
      Username: userData.email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();

        // Decode the ID token to get the userId
        const base64Url = idToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = JSON.parse(atob(base64));
        console.log(decodedData);
        const userId = decodedData.sub;
        console.log("User id", userId);


        setUser({ email: userData.email, userId: userId, token: accessToken });
        localStorage.setItem('user', JSON.stringify({ email: userData.email, userId: userId, token: accessToken, user_role: null, authCompleted: false }));
        setSuccessMessage("Login Successful...Redirecting");
        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      },
      onFailure: (err) => {
        setError("Invalid Username or Password");
        setTimeout(() => setError(null), 5000);
      }
    });

    setLoading(false);
  };

  const signUp = async (formData) => {
    setLoading(true);

    try {
      const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: formData.email }),
      ];
      userPool.signUp(formData.email, formData.password, attributeList, null, async (err, result) => {
        if (err) {
          setError(err.message || JSON.stringify(err));
          setTimeout(() => setError(null), 5000);
          return;
        }

        const userId = result.userSub; // Get the unique user ID from Cognito

        const response = await axios.post(USER_SIGNUP, {
          userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          securityQuestions: formData.securityQuestions.map((question, index) => ({
            question: question,
            answer: formData.securityAnswers[index],
          })),
          user_role: formData.user_role
        });

        if (response.status === 200) {
          setSuccessMessage("User Registered Successfully");
          setTimeout(() => {
            setSuccessMessage(false);
          }, 1000);
          await axios.post(VERIFY_USER, { email: formData.email });
        }
      });
    } catch (error) {
      setError("Error registering user");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthCompleted(false)
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ authCompleted, setAuthCompleted, setUser ,user, loginUserCred, logout, signUp, error, loading, successMessage }}>
      {children}
    </AuthContext.Provider>
  );
};
