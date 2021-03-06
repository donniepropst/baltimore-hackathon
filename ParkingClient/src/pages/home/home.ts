import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { CoordService } from '../../providers/coord-service';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [CoordService]
})
export class HomePage {

  private lat : number;
  private long : number;
  map : any;
  canPark : boolean;
  noResult : boolean;
  public restrictions: any[] ;
  exceptions: string;
  constructor(public navCtrl: NavController, private geolocation: Geolocation, private xyz : CoordService) {
    this.canPark = null;
    this.exceptions = "";
    this.restrictions = [];
    this.noResult = false;
  }

  setupAnswerPage(data : any)
  {
    console.log("Setting up Answer Page...");
    console.log(data);

    if(data.status == null || data.status == undefined)
    { // we found a result... 


    if(data.unless != null)
    {
      this.exceptions = data.unless;
    }
    if(data.valid)
    {
      this.canPark = true;
    }
    else
    {
      this.canPark = false;
    }
    if(data.restraints && data.restraints.length > 0)
    {
      for(var i = 0; i < data.restraints.length; i++)
      {
      this.restrictions.push(data.restraints[i])
      }
    }


    this.displayMap();

  }
  else
  {
      this.noResult = true;
  }

  }

  displayMap()
  {
    let location = new google.maps.LatLng(this.lat,this.long);
    let options = {
    center: location,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  let element: HTMLElement = document.getElementById('map');

  //console.log(element);
  this.map = new google.maps.Map(element, options);
    var marker = new google.maps.Marker({
          position: location,
          map: this.map
        });
  //console.log(this.map);
  }

  getLocation() {
	if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: true
      };
      let foundData : any;
      navigator.geolocation.getCurrentPosition(position => {
        console.info('using navigator');
        console.info(position.coords.latitude);
        console.info(position.coords.longitude);
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.xyz.sendCoords(this.lat, this.long)
        .then((result) => {
          if(result != null)
            foundData = result;
            this.setupAnswerPage(foundData);
        });
      }, error => {
        console.log(error);
      }, options);
      

    }
  }


}
