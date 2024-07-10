import { useEffect, useState } from "react";
import axios from "axios";
import style from "./newdashboard.module.css"
import { useNavigate } from "react-router";
const supportedStocks = ['GOOG','TSLA','AMZN','META','NVDA'];
const NewDashboard =()=>{
    let [email, setEmail]=useState("");
    let [password,setPassword]=useState("")
    let [stocks, setStocks]=useState([]);
    let [exist, setExist] =useState(false);
    let [data, setData] =useState([]);
    let  navigate=useNavigate()
    const handleSubscribe= (stock)=>{
        if(!stocks.includes(stock)){
            setStocks([...stocks, stock]);
        }
    };
    const handleClick=(event)=>{
        event.target.style.color="white";
        event.target.style.backgroundColor="black"
    }
    useEffect(()=>{
        axios.get("http://localhost:5006/user")
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    const handleData = () => {
        const emailExists = data.some((mail) => mail.Email === email);
        if (emailExists) {
            setExist(true);
        } else {
            const obj = {
                Email: email,
                Password:password,
                Stocks: stocks
            };
            axios.post("http://localhost:5006/user", obj)
                .then(() => {
                    console.log("data sent");
                    setData([...data, obj]); 
                    })
                .catch((error) => {
                    console.log(error);
                });
        }
        navigate("/exist")
    };
    useEffect(() => {
        if (exist) {
            alert("Email already exists");
            setExist(false); 
              }
    }, [exist]);
    return (
      <div id={style.newdash}>
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleData();
            }} id={style.form}>
                <label htmlFor="">Enter email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <label>Password</label>
                <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} required/>
                <h3>Stocks</h3>
                <div id={style.stock_div}>
                {supportedStocks.map((stock) => (
                    <button key={stock} onClick={(e) => {
                        e.preventDefault();
                        handleSubscribe(stock);
                        handleClick(e);
                    }} id={style.stock} className="stock">
                        {stock}
                    </button>
                ))}
                </div>
                <button type="Submit" id={style.submit}>Submit</button>
            </form>
        </div>
        </div>
    );
};
export default NewDashboard;