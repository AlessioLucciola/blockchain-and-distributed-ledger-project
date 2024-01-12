import axios from 'axios';

export const fetchETHPrice = async () => {
    try {
        const response = await axios.get(
            "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};