import React, { useState } from "react";
import cloudyVideo from "../../../src/img/cloudy.mp4";
import { faSun, faCloudSun, faCloud, faCloudRain, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'animate.css';
import Swal from 'sweetalert2'


const URL_BASE = "https://api.openweathermap.org/data/2.5/weather?&appid=08f90cb685ac696606f04d9cafa1ddc4&units=metric&lang=es"
const GEO_DB_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo/countries";



const Home = () => {

	const [searchWeather, setSearchWeather] = useState({
		city: "",
		country: ""
	})

	const [weather, setWeather] = useState(null)
	const [cities, setCities] = useState([])
	const [lastCountry, setLastCountry] = useState("");

	const handleChange = (event) => {
		setSearchWeather({
			...searchWeather,
			[event.target.name]: event.target.value
		});
	}
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			if (searchWeather.city.trim() === "" || searchWeather.country.trim() === "") {
				console.log("campos vacíos");
				Swal.fire({
					title: "Selecciona un país y una ciudad",
					confirmButtonColor: 'rgb(35, 64, 119)',					
					showClass: {
						popup: `
						animate__animated
						animate__fadeInUp
						animate__faster
					  `
					},
					hideClass: {
						popup: `
						animate__animated
						animate__fadeOutDown
						animate__faster
					  `
					}
				});;
				
				return;
			}

			setLastCountry(searchWeather.country);

			const url = `${URL_BASE}&q=${searchWeather.city},${searchWeather.country}`;
			console.log("URL generada:", url);

			const response = await fetch(url);
			const data = await response.json();

			if (data.cod === "404" || !data.weather) {
				console.log("Ciudad o país no encontrados");
				setWeather({ cod: "404" }); // Establece el estado para manejar el error
				return;
			}

			setWeather(data); // Establece el clima si la respuesta es correcta
		} catch (error) {
			console.error("Error al consultar el clima:", error.message);
		} finally {
			// Resetea los campos después de realizar la consulta
			setSearchWeather({
				city: "",
				country: ""
			});
		}


	};

	const weatherIcons = {
		"soleado": faSun,
		"cielo claro": faSun,
		"algo de nubes": faCloudSun,
		"nubes dispersas": faCloudSun,
		"muy nuboso": faCloud,
		"lluvia ligera": faCloudRain,
		"lluvioso": faCloudRain,
	};

	const weatherDescription = Array.isArray(weather?.weather) && weather?.weather[0]?.description.toLowerCase();
	const weatherIcon = weatherDescription ? weatherIcons[weatherDescription] : faCloud; // Por defecto, muestra una nube.

	const windIcons = {
		"soleado": faSun,
		"cielo claro": faSun,
		"algo de nubes": faCloudSun,
		"nubes dispersas": faCloudSun,
		"muy nuboso": faCloud,
		"lluvia ligera": faCloudRain,
		"lluvioso": faCloudRain,
	};

	const windDescription = weather?.wind?.dg;
	const wIcon = windIcons[windDescription] || faCloud;



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

							<div className="form-group mt-2">
								<label htmlFor="country">País:</label>
								<select className="form-control"
									id="country"
									name="country"
									onChange={handleChange}
									value={searchWeather.country}
								>
									<option value="">Selecciona el país</option>
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
									<option value="CN">Canadá</option>
									<option value="AU">Australia</option>
									<option value="JP">Japón</option>
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="city">Ciudad:</label>
								<input
									type="text"
									className="form-control"
									id="city"
									name="city"
									placeholder="Escribe la ciudad"
									onChange={handleChange}
									value={searchWeather.city} />
							</div>
							<button className="boton w-100 mt-4">Consultar</button>
						</form>
					</div>
					<div className="seccion2 col-11 col-md-4 m-2 p-3 d-flex items-center">

						{!weather ? "Consulta el tiempo en tu ciudad" :
							weather.cod === "404" ? <p className="error-message">No existe ninguna ciudad con ese nombre en {lastCountry}</p> :
								<>
									<div className="tempPanel animate__animated animate__fadeIn d-flex flex-column">
										<p className="temp p-2 mx-5 ">
											{Math.ceil(weather?.main?.temp)}ºC
										</p>
										<div className="m-auto">
											<p className="tempicon">

												<FontAwesomeIcon icon={weatherIcon} className="mx-2" />
											</p>
										</div>
									</div>
									<div className="animate__animated animate__fadeIn">

										<div>
											<h2 className="infotitulo">{weather?.name || "des"}</h2>

										</div>

										<div className="info">

											<p className="my-1">
												{weatherDescription || "sin información"}

											</p>
											<p  className="my-1">
												<span>Temp-max:</span> {Math.ceil(weather?.main?.temp_max)}ºC
											</p>
											<p className="my-1">
												<span>Temp-min:</span> {Math.ceil(weather?.main?.temp_min)}ºC
											</p>
											<p className="my-1">
												<span>Sensación térmica:</span> {Math.ceil(weather?.main?.feels_like)}ºC
											</p>
											<p className="my-1">
												<span>Humedad:</span> {Math.ceil(weather?.main?.humidity)}%
											</p>

											<p className="my-1">
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
