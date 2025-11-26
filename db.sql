-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-11-2025 a las 02:37:20
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_producto`
--

CREATE TABLE `detalle_producto` (
  `id_detalle` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_producto`
--

INSERT INTO `detalle_producto` (`id_detalle`, `id_proveedor`, `id_producto`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `valor_unit` float(5,2) NOT NULL,
  `caregoria` varchar(50) DEFAULT NULL,
  `referencia` varchar(20) NOT NULL,
  `creado_en` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `valor_unit`, `caregoria`, `referencia`, `creado_en`) VALUES
(1, 'queso', 999.99, 'comida', 'REF-001', '2025-11-25'),
(2, 'Tomate', 999.99, 'Verdura', 'REF-258', '2025-11-25'),
(3, '1', 999.99, '2', '3', '2025-11-25'),
(4, 'Arroz', 250.00, 'Grano', 'Ref-369', '2025-11-25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `direcion` varchar(50) NOT NULL,
  `correo` varchar(30) NOT NULL,
  `telefono` int(10) DEFAULT NULL,
  `creado_en` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `nombre`, `direcion`, `correo`, `telefono`, `creado_en`) VALUES
(1, 'COSTEñO', 'marsella real', 'jerez@gmail.com', 2147483647, '2025-11-25'),
(2, 'Abasto', 'Anillo vial', 'abasto@gmail.com', 2147483647, '2025-11-25'),
(3, '5', '6', '7', 8, '2025-11-25'),
(4, 'Diana', 'Anillo vial', 'diana@gmail.com', 2147483647, '2025-11-25');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_producto`
--
ALTER TABLE `detalle_producto`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `referencia` (`referencia`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalle_producto`
--
ALTER TABLE `detalle_producto`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_producto`
--
ALTER TABLE `detalle_producto`
  ADD CONSTRAINT `detalle_producto_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `detalle_producto_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
