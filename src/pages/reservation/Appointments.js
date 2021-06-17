import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  ViewState,
  EditingState,
  GroupingState,
  IntegratedGrouping,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Resources,
  Appointments,
  AppointmentTooltip,
  GroupingPanel,
  WeekView,
  MonthView,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  EditRecurrenceMenu,
  ConfirmationDialog,
  AppointmentForm,
  DragDropProvider,
} from "@devexpress/dx-react-scheduler-material-ui";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import Grid from "@material-ui/core/Grid";
import Room from "@material-ui/icons/Room";
import { withStyles } from "@material-ui/core/styles";
import classNames from "clsx";
import { db } from "../../services/firebase";
import { auth } from "../../services/firebase";
import moment from "moment";
import "moment/locale/es";

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenter: {
    textAlign: "center",
  },
  firstRoom: {
    background:
      "url(http://www.valldaurasport.com/media/image/noticias/web/20_Foto.1569103285.jpg)",
  },
  secondRoom: {
    background:
      "url(https://indusmetaltorres.es/wp-content/uploads/2018/04/Pista-padel-Carteya-verde-6005-1024x704.jpg)",
  },
  header: {
    height: "240px",
    backgroundSize: "cover",
  },
  commandButton: {
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  pista1: {
    backgroundColor: "red",
    borderRadius: "8px",
  },
  pista2: {
    backgroundColor: "orange",
    borderRadius: "8px",
  },
  clase:{
    backgroundColor: "magenta",
    borderRadius: "8px",
  }
});

const getClassByLocation = (classes, location) => {
  if (location === "Pista 1") return classes.firstRoom;
  return classes.secondRoom;
};

const getClassByLocation2 = (classes, location, title) => {
  if (location === "Pista 1" && title !== "Clase" && title !== "clase") return classes.pista1;
  if (location === "Pista 2" && title !== "Clase" && title !== "clase") return classes.pista2;
  if( title === "Clase" || "clase") return classes.clase
};

const Header = withStyles(style, { name: "Header" })(
  ({ children, appointmentData, classes, ...restProps }) => (
    <AppointmentTooltip.Header
      {...restProps}
      className={classNames(
        getClassByLocation(classes, appointmentData.location),
        classes.header
      )}
      appointmentData={appointmentData}
    >
      <IconButton
        /* eslint-disable-next-line no-alert */
        onClick={() => alert(JSON.stringify(appointmentData))}
        className={classes.commandButton}
      >
        <MoreIcon />
      </IconButton>
    </AppointmentTooltip.Header>
  )
);

const Appointment = withStyles(style, { name: "Appointments" })(
  ({ children, data, appointmentData, classes, ...restProps }) => (
    <Appointments.Appointment
      data={data}
      {...restProps}
      className={classNames(getClassByLocation2(classes, data.location, data.title))}
    >
      {children}
    </Appointments.Appointment>
  )
);

const Content = withStyles(style, { name: "Content" })(
  ({ children, appointmentData, classes, ...restProps }) => (
    <AppointmentTooltip.Content
      {...restProps}
      appointmentData={appointmentData}
    >
      <Grid container alignItems="center">
        <Grid item xs={2} className={classes.textCenter}>
          <Room className={classes.icon} />
        </Grid>
        <Grid item xs={10}>
          <span>{appointmentData.location}</span>
        </Grid>
      </Grid>
    </AppointmentTooltip.Content>
  )
);

const CommandButton = withStyles(style, { name: "CommandButton" })(
  ({ classes, ...restProps }) => (
    <AppointmentTooltip.CommandButton
      {...restProps}
      className={classes.commandButton}
    />
  )
);

const isWeekOrMonthView = (viewName) =>
  viewName === "Week" || viewName === "Month";

const priorityData = [
  { text: "Pista 1", id: 1, color: "lightBlue" },
  { text: "Pista 2", id: 2, color: "lightGreen" },
];

const styles = ({ spacing, palette, typography }) => ({
  formControlLabel: {
    padding: spacing(2),
    paddingLeft: spacing(10),
  },
  text: {
    ...typography.caption,
    color: palette.text.secondary,
    fontWeight: "bold",
    fontSize: "1rem",
  },
});

const GroupOrderSwitcher = withStyles(styles, { name: "ResourceSwitcher" })(
  ({ isGroupByDate, onChange, classes }) => (
    <FormControlLabel
      control={
        <Checkbox checked={isGroupByDate} onChange={onChange} color="primary" />
      }
      label="Grupo por Fecha Primero"
      className={classes.formControlLabel}
      classes={{ label: classes.text }}
    />
  )
);

const messages = {
  moreInformationLabel: "",
  detailsLabel: "Detalles",
  commitCommand: "GUARDAR",
  repeatLabel: "Repetir",
  never: "Nunca",
  daily: "Diario",
  weekly: "Semanal",
  monthly: "Mensual",
  yearly: "Anual",
  repeatEveryLabel: "Repatir Cada",
  daysLabel: "Dias(s)",
  endRepeatLabel: "Finalizar Repeticion",
  onLabel: "En",
  afterLabel: "Hasta",
  occurrencesLabel: "Veces",
  weeksOnLabel: "Semana(s)",
  monthsLabel: "Mes(es)",
  ofEveryMonthLabel: "De cada Mes",
  theLabel: "De",
  allDayLabel: "Todo el Dia",
  discardButton: "Descartar",
  cancelButton: "Cancelar",
  confirmDeleteMessage: "Estas seguro de que quieres borrar esta reserva?",
  confirmCancelMessage: "Descartar cambios?",
  deleteButton: "Eliminar",
  current: "Esta Reserva",
  currentAndFollowing: "Esta y las siguientes",
  all: "Todas",
  menuEditingTitle: "Borrar reserva recurrente",
  commitButton: "Aceptar",
  firstLabel: "Primer",
  secondLabel: "Segundo",
  thirdLabel: "Tercer",
  fourthLabel: "Cuarto",
  lastLabel: "Ultimo",
  yearsLabel: "Año(s)",
  ofLabel: "De",
  everyLabel: "Cada",
  today: "HOY"
};

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === "multilineTextEditor") {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  console.log(appointmentData)
  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    ></AppointmentForm.BasicLayout>
  );
};

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      data: [],
      currentDate: moment(),
      locale: "es-ES",
      resources: [
        {
          fieldName: "priorityId",
          title: "Pista",
          instances: priorityData,
        },
      ],
      grouping: [
        {
          resourceName: "priorityId",
        },
      ],
      isGroupByDate: true,
      groupByDate: isWeekOrMonthView,
      addedAppointment: {},
      appointmentChanges: {},
      editingAppointment: undefined,
    };
    this.changeLocale = (event) =>
      this.setState({ locale: event.target.value });
    this.currentDateChange = (currentDate) => {
      this.setState({ currentDate });
      this.myRef = React.createRef();
    };
    this.commitChanges = this.commitChanges.bind(this);
    this.commitChanges = this.commitChanges.bind(this);
    this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
    this.changeEditingAppointment = this.changeEditingAppointment.bind(this);
    this.onGroupOrderChange = () => {
      const { isGroupByDate } = this.state;
      this.setState({
        isGroupByDate: !isGroupByDate,
        groupByDate: isGroupByDate ? undefined : isWeekOrMonthView,
      });
    };
  }

  changeAddedAppointment(addedAppointment) {
    this.setState({ addedAppointment });
  }

  changeAppointmentChanges(appointmentChanges) {
    this.setState({ appointmentChanges });
  }

  changeEditingAppointment(editingAppointment) {
    this.setState({ editingAppointment });
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
        data.forEach((element) => {
          element.timestamp
            ? db.ref("reservas/" + element.timestamp).set({
                date: moment(element.startDate).format("DD MMMM yyyy"),
                start: moment(element.startDate).format("DD MMMM yyyy HH:mm"),
                end: moment(element.endDate).format("DD MMMM yyyy HH:mm"),
                timestamp: element.timestamp,
                uid: this.state.user.uid,
                email: element.title ? element.title : "Reservada",
                pista: `${"Pista"} ${element.priorityId}`,
                priorityId: element.priorityId,
                rRule: element.rRule ? element.rRule : "RRULE:INTERVAL=1;FREQ=DAILY;COUNT=1",
              })
            : db.ref("reservas/" + element.id).set({
                date: moment(element.startDate).format("DD MMMM yyyy"),
                start: moment(element.startDate).format("DD MMMM yyyy HH:mm"),
                end: moment(element.endDate).format("DD MMMM yyyy HH:mm"),
                timestamp: element.id,
                uid: this.state.user.uid,
                email: element.title ? element.title : "Reservada",
                pista: `${"Pista"} ${element.priorityId}`,
                priorityId: element.priorityId,
                rRule: element.rRule ? element.rRule : "RRULE:INTERVAL=1;FREQ=DAILY;COUNT=1",
              });
        });
      }
      if (changed) {
        data = data.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
        data.forEach((element) => {
          db.ref("reservas/" + element.timestamp).update({
            date: moment(element.startDate).format("DD MMMM yyyy"),
            start: moment(element.startDate).format("DD MMMM yyyy HH:mm"),
            end: moment(element.endDate).format("DD MMMM yyyy HH:mm"),
            timestamp: element.timestamp,
            uid: element.uid,
            email: element.title ? element.title : "Reservada",
            pista: `${"Pista"} ${element.priorityId}`,
            priorityId: element.priorityId,
            rRule: element.rRule ? element.rRule : "RRULE:INTERVAL=1;FREQ=DAILY;COUNT=1",
          });
        });
      }
      if (deleted !== undefined) {
        let deleted = db.ref("reservas/" + this.state.editingAppointment.id);
        deleted.remove();
        data = data.filter((appointment) => appointment.id !== deleted);
      }

      return { data };
    });
  }

  async componentDidMount() {
    try {
      db.ref("reservas").on("value", (snapshot) => {
        let reservations = [];
        let data = [];

        snapshot.forEach((snap) => {
          reservations.push(snap.val());
        });

        reservations.forEach((res) => {
          data.push({
            startDate: res.start,
            endDate: res.end,
            title: res.email,
            location: res.pista,
            id: res.timestamp,
            priorityId: res.priorityId,
            timestamp: res.timestamp,
            uid: res.uid,
            rRule: res.rRule,
          });
        });
        this.setState({ reservations });
        this.setState({
          data: data,
          currentDate: moment(),
          resources: [
            {
              fieldName: "priorityId",
              title: "Pista",
              instances: priorityData,
            },
          ],
          grouping: [
            {
              resourceName: "priorityId",
            },
          ],
          groupByDate: isWeekOrMonthView,
          isGroupByDate: true,
          addedAppointment: {},
          appointmentChanges: {},
          editingAppointment: undefined,
        });
      });
    } catch (error) {
      this.setState({ readError: error.message, loadingChats: false });
    }
  }

  render() {
    const {
      data,
      locale,
      resources,
      currentDate,
      grouping,
      groupByDate,
      isGroupByDate,
      addedAppointment,
      appointmentChanges,
      editingAppointment,
    } = this.state;
    return (
      <React.Fragment>
        <GroupOrderSwitcher
          isGroupByDate={isGroupByDate}
          onChange={this.onGroupOrderChange}
        />
        <Paper>
          <Scheduler data={data} locale={locale} height={"100%"}>
            <ViewState
              currentDate={currentDate}
              onCurrentDateChange={this.currentDateChange}
            />
            <EditingState
              onCommitChanges={this.commitChanges}
              addedAppointment={addedAppointment}
              onAddedAppointmentChange={this.changeAddedAppointment}
              appointmentChanges={appointmentChanges}
              onAppointmentChangesChange={this.changeAppointmentChanges}
              editingAppointment={editingAppointment}
              onEditingAppointmentChange={this.changeEditingAppointment}
            />
            <GroupingState grouping={grouping} groupByDate={groupByDate} />
            <WeekView
              firstDayOfWeek="1"
              displayName="SEMANA"
              startDayHour={9}
              endDayHour={23}
            />
            <MonthView 
              displayName="MES" 
              firstDayOfWeek="1"
            />
            <Toolbar />
            <DateNavigator />
            <TodayButton messages={messages}/>

            <Appointments appointmentComponent={Appointment} />

            <Resources data={resources} mainResourceName="priorityId" />
            <IntegratedGrouping />
            <EditRecurrenceMenu 
              messages={messages}
             />
            <ConfirmationDialog messages={messages} />
            <AppointmentTooltip
              headerComponent={Header}
              contentComponent={Content}
              commandButtonComponent={CommandButton}
              showCloseButton
            />
            <AppointmentForm
              basicLayoutComponent={BasicLayout}
              textEditorComponent={TextEditor}
              messages={messages}
            />
            <ViewSwitcher />
            <GroupingPanel />
            <DragDropProvider />
          </Scheduler>
        </Paper>
      </React.Fragment>
    );
  }
}
