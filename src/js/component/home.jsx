import React, { useState } from "react";
import cloudyVideo from "../../../src/img/cloudy.mp4";
import { faSun, faCloudSun, faCloud, faCloudRain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const URL_BASE = "https://api.openweathermap.org/data/2.5/weather?&appid=08f90cb685ac696606f04d9cafa1ddc4&units=metric&lang=es"

//create your first component
const Home = () => {

	const [searchWeather, setSearchWeather] = useState({
		city: "",
		country: ""
	})

	const [weather, setWeather] = useState(null)

	const handleChange = (event) => {
		setSearchWeather({
			...searchWeather,
			[event.target.name]: event.target.value
		})
	}
	const handleSubmit = async (event) => {
		event.preventDefault()

		try {
			if (searchWeather.city.trim() === "" || searchWeather.country.trim() === "") {
				console.log("campos vacíos"); //SWEET ALERT AQUI FORMIK?
				return
			}
			// const response = await fetch(`${URL_BASE}&q=${searchWeather.city},${searchWeather.country}`)
			const url = `${URL_BASE}&q=${searchWeather.city},${searchWeather.country}`;
			console.log("URL generada:", url);
			const response = await fetch(url);

			if (!response) {
				throw new Error("no se recibieron los datos")
			}
			const data = await response.json()
			console.log(data);

			setWeather(data)


		} catch (error) {
			console.log(error.message);

		}

	}

	const weatherIcons = {
		"soleado": faSun,
		"cielo claro": faSun,
		"algo de nubes": faCloudSun,
		"nubes dispersas": faCloudSun,
		"muy nuboso": faCloud,
		"lluvia ligera": faCloudRain,
		"lluvioso": faCloudRain,
	};

	const weatherDescription = weather?.weather[0]?.description.toLowerCase();
	const weatherIcon = weatherIcons[weatherDescription] || faCloud; // Por defecto, muestra una nube.



	return (
		<>
			<div className="video-background">
				<video autoPlay loop muted>
					<source src={cloudyVideo} type="video/mp4" />
					Tu navegador no soporta videos en HTML5.
				</video>
			</div>
			<div className="container mt-5">
				<div className="row d-flex justify-content-center">
					<div className="col-12 my-md-3">
						<h1 className="titulo text-center">El Tiempo</h1>
					</div>
					<div className="seccion1 col-11 col-md-4 m-2 p-3">
						<form
							onSubmit={handleSubmit}>
							<div className="form-group">
								<label htmlFor="city">Ciudad:</label>
								<input
									type="text"
									className="form-control"
									id="city"
									name="city"
									onChange={handleChange} />
							</div>
							<div className="form-group mt-2">
								<label htmlFor="country">País:</label>
								<select className="form-control"
									id="country"
									name="country"
									onChange={handleChange}>
									<option value=""></option>
									<option value="ES">España</option>
									<option value="GB">Reino Unido</option>
									<option value="FR">Francia</option>
									<option value="DE">Alemania</option>
									<option value="IT">Italia</option>
									<option value="PT">Portugal</option>
									<option value="NL">Países Bajos</option>
									<option value="MX">México</option>
									<option value="CO">Colombia</option>
									<option value="VE">Venezuela</option>
									<option value="BR">Brasil</option>
									<option value="US">Estados Unidos</option>
									<option value="CN">"Canadá</option>
									<option value="AU">Australia</option>
									<option value="NZ">Nueva Zelanda</option>
									<option value="JP">Japón</option>
								</select>
							</div>
							<button className="boton w-100 mt-4">Consultar</button>
						</form>
					</div>
					<div className="seccion2 col-11 col-md-4 m-2 p-3 d-flex items-center">

						{!weather ? "Consulta el tiempo en tu ciudad" :
							weather.cod === "404" ? "Valida la ciudad y el país" :
								<>
									<div className="tempPanel d-flex flex-column">
										<p className="temp p-2 mx-5 ">
											{Math.ceil(weather?.main?.temp)}ºC
										</p>
										<div className="m-auto">
										<p className="tempicon">

											<FontAwesomeIcon icon={weatherIcon} className="mx-2" />
										</p>
										</div>
									</div>
									<div>

										<div>
											<h2 className="infotitulo">{weather?.name}</h2>

										</div>

										<div className="info">

											<p>
												{weatherDescription}

											</p>
											<p >
												<span>Temp-max:</span> {Math.ceil(weather?.main?.temp_max)}ºC
											</p>
											<p>
												<span>Temp-min:</span> {Math.ceil(weather?.main?.temp_min)}ºC
											</p>
											<p>
												<span>Sensación térmica:</span> {Math.ceil(weather?.main?.feels_like)}ºC
											</p>
											<p>
												<span>Humedad:</span> {Math.ceil(weather?.main?.humidity)}%
											</p>

											<p>
												<span>Viento:</span> {Math.ceil(weather?.wind?.speed)}km/h
											</p>



										</div>



									</div>
								</>
						}

					</div>
				</div>
			</div>
		</>
	);
}

export default Home;
