// Import des hooks nécessaires
import { useState } from 'react'; // Pour gérer l'état local (erreur)
import { useNavigate } from 'react-router'; // Pour la navigation
import { useDispatch } from 'react-redux'; // Hook Redux pour envoyer des actions
import { setCredentials } from '../store/authSlice'; // Action Redux qu'on va utiliser

function SignIn() {
  // État local pour gérer l'affichage des erreurs
  const [error, setError] = useState(false);

  // Hook pour la navigation programmatique
  const navigate = useNavigate();

  // Hook Redux pour dispatcher (envoyer) des actions
  const dispatch = useDispatch();

  // Fonction appelée quand le formulaire est soumis
  const handleSubmit = async (e) => {
    // Empêche le rechargement de la page
    e.preventDefault();

    // Récupère les valeurs des champs du formulaire
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Validation basique des champs
    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      // Appel à l'API pour authentifier l'utilisateur
      const response = await fetch('http://localhost:3001/api/v1/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('response', response);

      // Conversion de la réponse en JSON
      const data = await response.json();
      console.log('data', data);
      // Si la connexion est réussie
      if (response.ok) {
        // On envoie les données de l'utilisateur dans le store Redux
        // Cette action sera traitée par le reducer dans authSlice
        dispatch(
          setCredentials({
            token: data.body.token, // Token d'authentification
          })
        );

        // Redirection vers la page utilisateur
        navigate('/user');
      } else {
        // En cas d'échec, on affiche une erreur
        setError(true);
      }
    } catch (err) {
      // En cas d'erreur réseau ou autre, on affiche une erreur
      setError(true);
    }
  };

  // Rendu du composant
  return (
    <>
      <main className="main bg-dark">
        <section className="sign-in-content">
          {/* Icône utilisateur de Font Awesome */}
          <i className="fa fa-user-circle sign-in-icon"></i>
          <h1>Sign In</h1>

          {/* Message d'erreur conditionnel */}
          {error && (
            <p className="error-message">Invalid username or password</p>
          )}

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit}>
            {/* Champ email */}
            <div className="input-wrapper">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" />
            </div>

            {/* Champ password */}
            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" />
            </div>

            {/* Checkbox "Remember me" */}
            <div className="input-remember">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            {/* Bouton de soumission */}
            <button className="sign-in-button" type="submit">
              Sign In
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default SignIn;
