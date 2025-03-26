import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setUserInfo } from '../store/authSlice';
import React from 'react';

function User() {
  // État local pour gérer le mode édition
  const [isEditing, setIsEditing] = useState(false);
  // États pour les valeurs des inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { token, isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fonction pour gérer l'ouverture du mode édition
  const handleEditClick = () => {
    setIsEditing(true);
    // Initialise les inputs avec les valeurs actuelles
    setFirstName(user.firstName);
    setLastName(user.lastName);
  };

  // Fonction pour annuler l'édition
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Fonction pour sauvegarder les modifications
  const handleSave = async () => {
    try {
      // Appel API avec la même structure que votre fetchUserProfile
      const response = await fetch(
        'http://localhost:3001/api/v1/user/profile',
        {
          method: 'PUT', // Changement de la méthode en PUT pour la mise à jour
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Utilisation du même dispatch que dans votre useEffect
        dispatch(setUserInfo({ ...data.body }));
        // Fermeture du mode édition
        setIsEditing(false);
      } else {
        console.error('Update failed:', data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Vérifie si l'utilisateur est authentifié
        if (!isAuthenticated) {
          navigate('/sign-in');
          return;
        }

        // Appel API
        const response = await fetch(
          'http://localhost:3001/api/v1/user/profile',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Utilisation du token du store
            },
            body: JSON.stringify({ test: 'test' }),
          }
        );

        const data = await response.json();
        console.log('data', data);

        dispatch(setUserInfo({ ...data.body }));
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/sign-in');
      }
    };

    // Appel de la fonction
    fetchUserProfile();
  }, [isAuthenticated, navigate, token]);

  console.log('user', user);
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <main className="main bg-dark">
      <div className="header">
        {!isEditing ? (
          // Affichage normal
          <>
            <h1>
              Welcome back
              <br />
              {user?.firstName} {user?.lastName}!
            </h1>
            <button className="edit-button" onClick={handleEditClick}>
              Edit Name
            </button>
          </>
        ) : (
          // Mode édition
          <>
            <h1>Welcome back</h1>
            <div className="edit-inputs">
              <div className="input-row">
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                  />
                </div>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div className="edit-buttons">
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  );
}

export default User;
