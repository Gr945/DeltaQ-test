import { useEffect, useState } from "react";
import "./Form.css";

function Form() {
  const [data, setData] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("")
  const [companyShortName, setCompanyShortName] = useState("");
  const [companyLongName, setCompanyLongName] = useState("");
  const [innKPP, setInnKPP] = useState("");
  const [address, setAddress] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  var url =
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
  var token = "c556f1040058b5559b43a1b658e5d38ee3b6cf37";

  const getCompanys = () => {
    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({ query: companyName }),
    };
    if (companyName) {
      fetch(url, options)
        .then((response) => response.json())
        .then((result) => {
          setData(result.suggestions);
        })
        .catch((error) => alert("error", error));
    }
  };
  useEffect(() => {
    if (!!companyName.length) {
      getCompanys();
    } else {
      setCompanyShortName("");
      setCompanyLongName("");
      setInnKPP("");
      setAddress("");
    }
  }, [companyName]);

  console.log(data);
  const handleSubmit = (company) => {
    setCompanyName(company.value);
    setCompanyShortName(company.data.name.short_with_opf || "-");
    setCompanyLongName(company.data.name.full_with_opf || "-");
    setInnKPP((company.data.inn || "-") + " / " + (company.data.kpp || "-"));
    setAddress(company.data.address.value || "-");
    setCompanyType(company.data.type || '-')
    setIsOpen(false);
  };
  return (
    <form className="form">
      <h1 className="header">Компания или ИП</h1>
      <input
        className="firstInput"
        onChange={(e) => {
          setIsOpen(true);
          setCompanyName(e.target.value);
        }}
        value={companyName}
      />
      {companyName.length > 0 && isOpen && (
        <div className="menu">
          {data.map((company) => (
            <div
              className="element"
              onClick={() => handleSubmit(company)}
              key={company.data.address.value}
            >
              {company.value}
            </div>
          ))}
        </div>
      )}
      <p className="text">Организация ({companyType})</p>
      <div className="textInput">
        <p className="text">Краткое наименование</p>
        <input value={companyShortName} readOnly />
      </div>
      <div className="textInput">
        <p className="text">Полное наименование</p>
        <input value={companyLongName} readOnly />
      </div>
      <div className="textInput">
        <p className="text">ИНН / КПП</p>
        <input value={innKPP} readOnly />
      </div>
      <div className="textInput">
        <p className="text">Адрес</p>
        <input value={address} readOnly />
      </div>
    </form>
  );
}

export default Form;
