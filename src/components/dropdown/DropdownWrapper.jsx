import { BsThreeDotsVertical } from "react-icons/bs";

const DropdownWrapper = ({
  children,
  className = "",
  id = "triggerId",
  color = "dark",
  hasImageButton = false,
  image,
}) => {

    if(hasImageButton){
        return (
            <><div
            className="rounded-circle bg_secondary ms-3"
            type="button"
            id={id}
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
              style={{
                width: "32px",
                height: "32px",
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                cursor: "pointer",
              }}
          />
          
          <div
            className={`dropdown-menu dropdown-menu-${color}`}
            aria-labelledby={id}
          >
            {children}
          </div></>
          );
    }else{
        return (
            <div className={`${className} dropdown open`}>

              <button
                className="btn border-0"
                type="button"
                id={id}
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <BsThreeDotsVertical />
              </button>
              
              <div
                className={`dropdown-menu dropdown-menu-${color}`}
                aria-labelledby={id}
              >
                {children}
              </div>
            </div>
          );
    }
  
};

export default DropdownWrapper;
