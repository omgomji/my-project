function Cars({ car }) {
    return (
        <span>
            {car.id}. {car.brand} <b>{car.model}</b> - {car.price}
        </span>
    )
}

export default Cars;