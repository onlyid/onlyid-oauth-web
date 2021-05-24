import React, { PureComponent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    FormControl,
    FormHelperText,
    Input,
    InputAdornment,
    List,
    ListItem,
    ListItemText
} from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import styles from "./RegionInput.module.css";
import CHINA_CITY_LIST from "my/china-city-list";

class RegionInput extends PureComponent {
    static defaultProps = {
        label: "地区"
    };

    state = {
        dialogVisible: false,
        provinceIndex: -1
    };

    toggleDialog = () => {
        this.setState(state => ({ dialogVisible: !state.dialogVisible, provinceIndex: -1 }));
    };

    select = city => {
        const { provinceIndex } = this.state;
        const { onChange } = this.props;

        onChange([CHINA_CITY_LIST[provinceIndex].province, city]);
        this.toggleDialog();
    };

    clear = () => {
        const { onChange } = this.props;

        onChange("");
        this.toggleDialog();
    };

    render() {
        const { dialogVisible, provinceIndex } = this.state;
        const { value, label } = this.props;

        const listItems =
            provinceIndex <= -1
                ? CHINA_CITY_LIST.map((item, index) => (
                      <ListItem
                          className={styles.item1}
                          button
                          onClick={() => this.setState({ provinceIndex: index })}
                          key={index}
                      >
                          <ListItemText primary={item.province} />
                          <KeyboardArrowRight />
                      </ListItem>
                  ))
                : CHINA_CITY_LIST[provinceIndex].city.map(city => (
                      <ListItem
                          className={styles.item1}
                          button
                          onClick={() => this.select(city)}
                          key={city}
                      >
                          <ListItemText primary={city} />
                      </ListItem>
                  ));

        return (
            <>
                <FormControl fullWidth onClick={this.toggleDialog}>
                    <Input
                        id="region"
                        value={(value && value.join(" - ")) || ""}
                        readOnly
                        startAdornment={<InputAdornment position="start">{label}</InputAdornment>}
                    />
                    <FormHelperText />
                </FormControl>
                <Dialog open={dialogVisible} onClose={this.toggleDialog}>
                    <List className={styles.list1}>{listItems}</List>
                    <DialogActions style={{ justifyContent: "space-between" }}>
                        <Button onClick={this.clear} color="primary">
                            暂不设置
                        </Button>
                        <Button onClick={this.toggleDialog} color="primary">
                            取 消
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default RegionInput;
